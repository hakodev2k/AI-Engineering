# Agent Context-Compaction Continuity Contract

## Topic
Prevent long-running AI engineering tasks from silently losing task-critical operational state when conversation/model context is compacted or replaced.

## Category
**Thinking**

## Problem
Automatic context compaction can preserve the high-level goal while losing dynamic state needed for correct execution: active client context, recent constraints, recoverable tool evidence, changed files, test outcomes, current stage, retry budgets, pending approvals, active resource handles, or the next concrete action. If the agent resumes without detecting those gaps, it can repeat work, violate constraints, mis-handle resources, or execute the wrong next step.

## Evidence
Recent public reports show multiple independent continuity failures:
- OpenAI Codex #37121 (2026-08-05): recoverable tool state can become unavailable after truncation plus compaction.
- OpenAI Codex #38269 (2026-08-12): unchanged client `additionalContext` can disappear after automatic compaction.
- OpenAI Codex #36721 (2026-08-03): requests structured checkpoints with a lossless operational tail because operational progress can be lost.
- Additional intent-loss reports exist in Codex #18720 and Claude Code #23776.

See `evidence/research.md` for source links, observed evidence, interpretation, existing approaches, limitations, and root-cause hypotheses.

## Existing approach
Most agent systems rely primarily on free-form summary/compaction, larger context windows, re-reading repository/session state, or persistent project instruction files.

## Existing limitations
Narrative summaries are lossy and difficult to validate mechanically. Static instruction files do not capture dynamic progress. Re-reading state after a loss is expensive and may still miss unknown omissions. Larger context windows delay rather than remove state-transition boundaries.

## Proposed improvement
Treat compaction as a controlled state transition:

`Prepare → Capture operational checkpoint → Validate → Compact narrative → Rehydrate → Reconcile → Resume or Stop`

The package separates a lossy narrative summary from a small structured operational checkpoint. The checkpoint contains only externally communicable execution state, not hidden chain-of-thought.

## Architecture
- **Checkpoint Curator** captures task-critical state.
- **Deterministic Guard** validates required fields, evidence pointers, resource identity, next action, size, and secret-like keys.
- **Narrative Compactor** remains platform/model-specific.
- **Continuity Verifier** independently reconciles rehydrated state against authoritative sources.
- **Execution Agent** resumes only after PASS.
- **Final Verifier** validates final completion claims against the latest task contract.

## Package structure
```text
agent-context-compaction-continuity-contract/
├── README.md
├── guide-intergration.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── examples/
│   └── checkpoint.json
├── skills/
│   └── core-skills.md
├── rules/
│   └── engineering-rules.md
├── subagents/
│   └── subagents.md
├── workflows/
│   └── workflows.md
├── hooks/
│   └── hooks.md
├── scripts/
│   └── context_checkpoint_guard.py
└── tests/
    └── test_context_checkpoint_guard.py
```

## Installation
Requires Python 3.10+ for the deterministic validator. No third-party runtime dependency is required.

Clone/copy this package into the agent host or automation repository and make the guard executable if desired:

```bash
chmod +x scripts/context_checkpoint_guard.py
```

For tests, install `pytest` in the development environment.

## Configuration
Edit `config/policy.json` to define:
- required checkpoint fields;
- checkpoint byte budget;
- fact/assumption/file limits;
- evidence requirements;
- secret-like key fragments;
- active-resource requirements;
- bounded validation retry behavior.

Do not relax required invariants merely to make a failed checkpoint pass.

## Usage
Start from `examples/checkpoint.json`, populate it from current authoritative state, then run:

```bash
python scripts/context_checkpoint_guard.py .agent-state/checkpoint.json --policy config/policy.json
```

For machine-readable output:

```bash
python scripts/context_checkpoint_guard.py .agent-state/checkpoint.json --policy config/policy.json --json
```

Exit codes:
- `0`: valid checkpoint;
- `2`: continuity/policy violation;
- `3`: invalid JSON/input/policy;
- `4`: reserved for I/O/execution integration errors.

## Workflow
The primary workflow is defined in `workflows/workflows.md`:
1. Observe task-critical state.
2. Capture checkpoint and increment generation.
3. Validate; repair at most twice.
4. Compact narrative context.
5. Rehydrate required operational fields.
6. Reconcile dynamic state against Git/task/test/resource authorities.
7. Resume only on PASS.
8. If reconciliation fails, perform one targeted reconstruction pass, then stop.

The package also includes a regression benchmark workflow and a recovery workflow for sessions that compacted without a checkpoint.

## Metrics
Track at least:
- continuity required-field coverage;
- orphaned active-resource count;
- unverified resume count;
- contradictory-state count;
- duplicate/repeated work after compaction;
- recovery tool calls/re-reads;
- checkpoint bytes/tokens;
- time-to-resume;
- task correctness on forced-compaction replay tests.

Do not claim improvement solely because checkpoint size is smaller. Correctness and verified continuity take priority.

## Verification
### Implemented
A structured checkpoint schema/policy, deterministic validator, rules, workflows, hooks, subagent contracts, integration guide, example, and tests are present.

### Measured
Hosts must run the Continuity Regression Benchmark in `workflows/workflows.md` against representative long-running tasks to collect before/after metrics.

### Verified
A production integration is verified only when:
- every required checkpoint passes the guard;
- post-compaction dynamic resources are reconciled;
- no high-risk action proceeds with missing approval/constraint state;
- replay/regression tests show no task-correctness regression;
- claimed reductions in duplicate work/recovery calls are measured.

## Safety
- Never serialize secret values; store only resource/secret handles.
- Never store or request hidden chain-of-thought. Use Facts, Assumptions, Decisions, Evidence, Risks, and Verification Status.
- Pending approvals must be revalidated against the authoritative approval source after resume.
- Retry counters and stop conditions must survive compaction.
- Missing or contradictory required state blocks mutation rather than being guessed.
- High-risk changes require independent verification when relevant.

## Failure handling
### Detection
Guard failure, unresolved resource identity, contradictory repository/task state, missing approval, missing evidence, or uncertain next action.

### Evidence
Return exact field/resource discrepancies without fabricating replacements.

### Retry policy
- checkpoint repair: maximum 2 attempts;
- authoritative post-compaction reconstruction: maximum 1 pass.

### Fallback
Stop mutation, retain the last known good checkpoint, and reconstruct from authoritative state if available.

### Escalation
Require human or host-level resolution when an invariant cannot be recovered safely.

### Stop condition
Retry/reconstruction budget exhausted or required state remains unknown/contradictory.

## Definition of Done
The package/integration is complete only when all of the following are evidenced:
- current public problem evidence is documented;
- current approaches and limitations are documented;
- checkpoint policy is configured;
- deterministic validator is integrated;
- pre-compaction and post-compaction hooks are wired;
- required-field coverage is 100% before resume;
- active resources and approvals are reconciled;
- validator tests pass;
- forced-compaction regression scenarios are executed;
- no correctness regression remains;
- duplicate-work/recovery metrics are collected;
- risks and unresolved limitations are documented;
- no secret values are stored in checkpoints;
- final verification is independent for high-risk changes.

## Customization
Add domain-specific invariants to `config/policy.json`, such as deployment target, migration state, selected browser/profile, PR/issue identity, subagent/team identity, remote shell, build job, database transaction, or external workflow run. Prefer opaque durable IDs and evidence references over copying large logs into the checkpoint.

Keep the contract focused: only state whose loss can change correctness, safety, or execution reliability should be mandatory.
