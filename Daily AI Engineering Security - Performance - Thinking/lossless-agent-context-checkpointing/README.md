# Lossless Agent Context Checkpointing

## Topic
Lossless operational checkpointing for long-running AI coding/agent sessions before context compaction.

## Category
**Token**

## Problem
Long-running agents eventually need to compact, truncate, or restart context. Platform compaction is useful, but recent public issue reports show failure modes where:

- compaction triggers too late and cannot complete;
- large tool output is truncated and useful recoverable state is no longer available to continuation;
- continuation loses operational details such as successful/failed actions, changed files, tests, blockers, and the next concrete step;
- mixed-model subagents use the wrong context-window assumptions;
- a cold prompt cache or oversized request can leave a session unrecoverable.

This package treats transcript compaction and durable workflow state as separate concerns.

## Evidence
The research is documented in `evidence/research.md` and is based on recent public reports including:

- OpenAI Codex issue #37121 — tool/function output truncation followed by compaction can lose recoverable state.
- OpenAI Codex issue #36721 — request for structured, cost-aware checkpoints with a lossless operational tail.
- OpenAI Codex issue #36669 — request for active/selective context management.
- OpenAI Codex issue #29319 — automatic compaction reached full context and failed.
- Anthropic Claude Code issue #79989 — long-context sessions becoming unrecoverable when cache is cold and compaction itself cannot execute.
- Anthropic Claude Code issue #83355 — subagent compaction using the coordinator’s context-window assumption.
- OpenAI model/API guidance — monitor context usage, compact after meaningful milestones, and treat provider compaction items as opaque.

See the research file for exact URLs and the distinction between observed evidence, interpretation, and this package’s proposed solution.

## Existing approach
Typical agent runtimes use some combination of:

1. platform automatic compaction;
2. manual `/compact`-style commands;
3. free-form summaries;
4. full transcript replay;
5. prompt caching;
6. transcript-resident tool output.

## Existing limitations
These mechanisms do not by themselves guarantee an application-readable durable record of the engineering state needed to resume a task. Waiting until the hard context boundary also risks entering a state where the compaction request itself cannot complete. Prompt cache is an optimization, not durable state. Free-form summaries are difficult to verify and may omit negative operational knowledge or exact artifact references.

## Proposed improvement
Add a provider-independent checkpoint protocol around native compaction:

```text
Measure per-model budget
  -> preserve recovery reserve
  -> checkpoint observable task state
  -> externalize large durable artifacts
  -> deterministically verify checkpoint
  -> compact using native provider/platform mechanism
  -> validate resume integrity
  -> continue or enter bounded recovery
```

The checkpoint stores observable task state, not private chain-of-thought.

## Architecture

### Layer 1 — Budget controller
Computes context pressure for the **active model/agent**, applying soft, checkpoint, and hard-stop thresholds plus a recovery reserve.

### Layer 2 — Operational checkpoint
Stores:
- goal;
- hard constraints;
- confirmed facts;
- assumptions still requiring verification;
- decisions with short rationale/reversal condition;
- changed files;
- commands/tests and outcomes;
- external artifact references;
- blockers;
- next actions;
- verification status;
- failed approaches worth preserving.

### Layer 3 — Artifact store
Moves large durable tool output out of transcript context. References contain stable path/URI, size, purpose, and SHA-256 when available.

### Layer 4 — Verifier
Checks required fields, checkpoint size, artifact hashes, verification evidence, and resumed-state invariants.

### Layer 5 — Native compaction
Invokes the provider/platform mechanism only after a verified checkpoint exists.

### Layer 6 — Recovery
Restores the newest verified checkpoint and only the artifacts needed to continue. Recovery retries are bounded and escalate instead of guessing.

## Package structure

```text
lossless-agent-context-checkpointing/
├── README.md
├── guide-intergration.md
├── config/
│   └── checkpoint-policy.json
├── evidence/
│   └── research.md
├── examples/
│   └── task-state.example.json
├── hooks/
│   └── hooks.md
├── rules/
│   └── engineering-rules.md
├── scripts/
│   ├── context_checkpoint.py
│   └── verify_checkpoint.py
├── skills/
│   └── core-skills.md
├── subagents/
│   └── subagents.md
├── tests/
│   └── test_checkpoint_contract.py
├── verification/
│   └── verification-report.md
└── workflows/
    └── workflows.md
```

## Installation

Requirements:
- Python 3.10+;
- an agent/runtime that can expose or estimate active context usage;
- durable storage for checkpoints/artifacts;
- a native compaction/restart mechanism or a new-session resume path.

No third-party Python dependency is required by the included scripts.

Clone or copy this package into the host repository, then keep runtime checkpoint storage outside source control unless the data is intentionally sanitized.

Recommended runtime layout:

```text
.agent-state/<task-id>/checkpoints/
.agent-state/<task-id>/artifacts/
.agent-state/<task-id>/events/
```

## Configuration

Edit `config/checkpoint-policy.json`.

Default policy intent:
- start preparing around 70% context utilization;
- checkpoint around 78%;
- stop ordinary continuation around 88%;
- keep a 24k-token recovery reserve;
- keep the operational tail bounded;
- require checkpoint validation before compaction;
- require artifact hashes for external local artifacts;
- allow one normal compaction retry.

These are conservative package defaults, **not provider specifications**. Tune them using actual model limits, observed task characteristics, tool-output sizes, and recovery tests.

## Usage

### 1. Calculate context-budget action

```bash
python scripts/context_checkpoint.py budget \
  --model <active-model> \
  --limit <effective-context-limit> \
  --used <current-input-tokens> \
  --policy config/checkpoint-policy.json
```

Actions:
- `continue`
- `prepare-checkpoint`
- `checkpoint-now`
- `hard-stop`

### 2. Maintain observable task state
Start from:

```text
examples/task-state.example.json
```

Keep this state current during meaningful events rather than reconstructing it only after context becomes full.

### 3. Externalize a durable tool artifact

```bash
python scripts/context_checkpoint.py artifact \
  --path <artifact-file> \
  --purpose "<why continuation needs it>" \
  --producer "<tool/command>" \
  --media-type <media-type>
```

### 4. Build checkpoint

```bash
python scripts/context_checkpoint.py build \
  --input <task-state.json> \
  --output <checkpoint.json> \
  --policy config/checkpoint-policy.json
```

### 5. Verify checkpoint

```bash
python scripts/verify_checkpoint.py \
  <checkpoint.json> \
  --policy config/checkpoint-policy.json
```

Only compact after exit code `0`.

### 6. Invoke native compaction
Use the provider/platform mechanism appropriate to the host. Do not parse opaque provider-private compaction internals.

### 7. Validate resume state

```bash
python scripts/verify_checkpoint.py \
  <checkpoint.json> \
  --policy config/checkpoint-policy.json \
  --resume-state <resume-state.json>
```

Sensitive or destructive actions should be gated on successful resume validation.

## Workflow
Detailed workflow definitions are in `workflows/workflows.md`.

The primary flow is:

```text
Observe context pressure
       ↓
Resolve ACTIVE model limit
       ↓
Checkpoint threshold reached?
 ├─ No → Continue
 └─ Yes
       ↓
Collect operational state
       ↓
Externalize durable large outputs
       ↓
Build checkpoint
       ↓
Deterministic validation
       ↓
Independent verification
       ↓
Valid?
 ├─ No → one correction → recovery/stop
 └─ Yes
       ↓
Native compaction
       ↓
Resume validation
       ↓
Consistent?
 ├─ No → bounded recovery
 └─ Yes → Continue
```

## Skills
`skills/core-skills.md` defines reusable procedures for:
- context-budget accounting;
- operational checkpoint construction;
- lossless tool-artifact externalization;
- resume-integrity validation.

Each skill contains triggers, inputs, procedures, metrics, verification, failure handling, and stop conditions.

## Rules
`rules/engineering-rules.md` defines enforceable `MUST`, `MUST NOT`, and `SHOULD` constraints.

Critical rules include:
- compute budget per active model;
- never wait for a full window to checkpoint;
- never treat prompt cache as durable state;
- never compact after checkpoint validation fails;
- preserve failed approaches/blockers needed to avoid repeated work;
- do not persist private reasoning traces;
- do not delete the last recoverable copy of a required artifact.

## Subagents
`subagents/subagents.md` defines non-overlapping roles:
- Context Budget Analyst;
- Checkpoint Curator;
- Checkpoint Verifier;
- Recovery Agent.

The curator cannot be the sole verifier of its own checkpoint.

## Hooks
`hooks/hooks.md` defines lifecycle hooks for:
- task/model start;
- large tool output;
- pre-compaction checkpoint construction;
- pre-compaction verification;
- post-compaction resume validation;
- subagent handoff;
- final verification.

## Metrics
Track at minimum:

### Token metrics
- input tokens before checkpoint;
- context ratio at checkpoint;
- remaining recovery reserve;
- checkpoint approximate tokens;
- operational-tail tokens;
- input tokens after resume;
- full-history replay tokens avoided.

### Reliability metrics
- checkpoint validation failure rate;
- compaction failure rate;
- resume validation failure rate;
- artifact hash failure rate;
- recovery success rate;
- full-history fallback rate;
- human escalation rate.

### Quality metrics
- repeated failed approach count after resume;
- missing changed-file incidents;
- missing blocker incidents;
- regression rate after compaction/resume;
- verification coverage before vs after resume.

Token reduction is not a success if task correctness degrades.

## Verification

### Implemented
This package includes:
- policy configuration;
- executable Python builder/budget/artifact utility;
- executable checkpoint/resume validator;
- contract tests;
- explicit rules, skills, subagents, workflows, hooks;
- research/evidence;
- integration guide;
- verification report.

### Measured
The package defines measurable thresholds and metrics. Runtime token reduction cannot be claimed until integrated into a real host and compared against that host’s baseline.

### Verified
Repository/package integrity is verified in `verification/verification-report.md`. Provider-specific runtime recovery remains an integration verification step because this package does not control a live Codex/Claude/custom agent runtime.

## Safety
- Never persist credentials or secrets into checkpoints/artifacts.
- Do not store hidden chain-of-thought.
- Treat assumptions as unverified until evidence changes their status.
- Keep sensitive/destructive tools gated after resume until invariants pass.
- Prefer stopping to inventing missing state.
- Preserve the previous verified checkpoint until its replacement passes verification.

## Failure handling

### Checkpoint invalid
Allow one correction. If still invalid, do not compact.

### Artifact missing/hash mismatch
Stop resume or mark it blocked. Reconstruct from a trusted source or escalate.

### Native compaction fails
Do not repeatedly retry until the context is exhausted. Use the latest verified checkpoint and bounded recovery workflow.

### Active context already beyond hard-stop
Freeze optional high-context operations and create the smallest safe checkpoint possible. If checkpointing itself cannot complete, restore from the latest verified checkpoint rather than continuing blindly.

### Resume state inconsistent
Do not allow the implementation agent to improvise. Load the latest verified checkpoint and reconcile with observable repository/runtime state.

## Definition of Done
This package is integrated successfully when all of the following are true:

- active model context limit is resolved per agent;
- a recovery reserve is enforced;
- checkpoint trigger occurs before the hard boundary;
- every checkpoint contains all required operational fields;
- large required tool outputs are externalized and verifiable;
- deterministic validator passes before native compaction;
- resume validator gates sensitive continuation;
- recovery retries are bounded;
- recovery drill succeeds without full-history replay;
- token footprint is lower than baseline;
- answer/task quality and regression rate are not worse than baseline;
- no secrets are persisted.

## Customization

### Different model/provider
Change the runtime adapter that supplies context limits and invokes native compaction. Keep checkpoint semantics provider-independent.

### Different storage
Replace local paths with object/blob/database URIs and implement equivalent existence/hash validation.

### Larger tool outputs
Lower `inlineMaxChars` and externalize earlier. Do not raise checkpoint size simply to keep raw tool data inline.

### High-risk engineering tasks
Add mandatory human approval after resume for production writes, infrastructure mutation, migrations, credential changes, or other irreversible operations.

### Multi-agent systems
Use one shared task checkpoint plus per-agent bounded handoff packets. Calculate each agent’s budget from its actual model.

## Sources
See `evidence/research.md` for current public-source details and URLs.

## Key takeaway
**Compaction should reduce transcript tokens; a verified checkpoint should preserve the engineering state required to continue. Do not make one mechanism responsible for both.**