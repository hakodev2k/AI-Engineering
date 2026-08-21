# Agent Evidence-Backed Completion Gate

## Topic
Evidence-backed semantic completion for AI coding agents.

## Category
**Thinking**

## Problem
AI agents can sound finished before a task is actually verified. Common failure modes include reporting “implemented” as if it were “verified,” claiming tests passed without current supporting output, conflating a focused test with full regression coverage, accepting stale evidence after later edits, or treating a successful process exit as semantic task completion while the agent loop is still mid-tool-use.

This package converts task completion from a prose judgment into a durable requirement-to-evidence contract and a deterministic completion gate.

## Evidence
Current public signals are documented in [`evidence/research.md`](evidence/research.md). The strongest signals include:
- OpenAI Codex issue #36718 (2026-08-03), requesting evidence-backed completion records at requirement granularity;
- Anthropic Claude Code issue #72480 (2026-06-30), reporting repeated unsupported status claims and a user-built adversarial assertion hook;
- Anthropic Claude Code issue #74761 (2026-07-06), reporting headless process exit 0 while the agent loop ends mid-task;
- Anthropic Claude Code issue #74142 (2026-07-05), requesting reusable bounded goal-verification loops.

The research file separates observed evidence from interpretation and this package's proposed solution.

## Existing approach
Typical agent systems currently rely on one or more of:
- natural-language final summaries;
- prompt instructions such as “verify before saying done”;
- self-review/evaluator prompts;
- process exit code or CI status;
- human reconstruction of proof from tool transcripts;
- custom hooks that scan assistant responses for unsupported assertions.

## Existing limitations
These approaches can remain fragile because they do not necessarily bind each requirement to a fresh, observable result. Prompt-only rules depend on model compliance. Self-review may reuse the same assumptions. Exit code proves process behavior, not semantic completion. CI proves only checks that were run. Transcript reconstruction becomes expensive after long sessions, compaction, resume, or multi-agent handoff.

## Proposed improvement
Use a host-visible evidence ledger and a deterministic gate:

```text
Request
  -> normalize requirements
  -> implement
  -> capture observable evidence at source
  -> invalidate stale evidence after later changes
  -> independently verify requirement/evidence consistency
  -> deterministic completion gate
       -> complete
       -> bounded remediation
       -> blocked/incomplete
```

The gate never asks for or stores hidden chain-of-thought. It operates on externally inspectable data only: requirements, changed paths, commands, exit codes, artifacts, test scope, freshness, uncertainty, and terminal run state.

## Architecture

### Requirement contract
Every material outcome gets a stable ID and mandatory/optional classification before final verification.

### Evidence ledger
Actual tests, commands, inspections, and artifacts are attached to requirement IDs when observed. Failed, skipped, unavailable, and stale checks remain visible.

### Freshness layer
If relevant files change after a test or inspection, prior evidence is invalidated conservatively. A host with dependency graph knowledge can provide a wider impacted-path set.

### Semantic terminal-state guard
`process_exit_code=0` is not enough. A run marked nonterminal, such as one ending at `tool_use` awaiting continuation, cannot pass.

### Completion gate
[`scripts/completion_gate.py`](scripts/completion_gate.py) validates the ledger, checks terminal state, enforces fresh allowed evidence for mandatory verified requirements, and emits a deterministic verdict with explicit exit codes.

### Independent verification
For high-risk work, the implementation agent must not be the sole verifier. Roles and handoff boundaries are defined in [`subagents/subagents.md`](subagents/subagents.md).

## Package structure

```text
agent-evidence-backed-completion-gate/
├── README.md
├── guide-intergration.md
├── config/
│   └── completion-policy.json
├── evidence/
│   └── research.md
├── examples/
│   └── task-spec.json
├── hooks/
│   └── hooks.md
├── rules/
│   └── engineering-rules.md
├── schemas/
│   └── completion-evidence.schema.json
├── scripts/
│   ├── completion_gate.py
│   └── evidence_probe.py
├── skills/
│   └── core-skills.md
├── subagents/
│   └── subagents.md
├── tests/
│   └── test_completion_gate.py
├── verification/
│   └── report.md
└── workflows/
    └── workflows.md
```

## Installation
Python 3.10+ is recommended. The executable scripts use only the Python standard library.

Copy the package into the repository or agent harness that owns task orchestration. At minimum, retain:

```text
config/completion-policy.json
scripts/completion_gate.py
scripts/evidence_probe.py
schemas/completion-evidence.schema.json
```

No secrets are required.

## Configuration
The default policy in [`config/completion-policy.json`](config/completion-policy.json):
- allows at most 2 remediation retries;
- requires fresh evidence for `verified`;
- requires all mandatory requirements to be verified;
- fails closed on nonterminal agent-loop state;
- accepts test/command/inspection/artifact evidence;
- requires accepted exit codes for command/test proof;
- never treats a model `claim` as verification evidence.

Customize evidence classifications or optional-item behavior for your system, but preserve the mandatory fresh-evidence and terminal-state invariants.

## Usage

### 1. Create the requirement ledger
Use [`examples/task-spec.json`](examples/task-spec.json) as a shape reference, but create requirement IDs from the actual task.

Validate:

```bash
python scripts/completion_gate.py validate \
  --ledger completion-evidence.json \
  --policy config/completion-policy.json
```

### 2. Implement against requirement IDs
The implementation agent reports changed paths and which requirements it believes are implemented, but this does not itself produce `verified` status.

### 3. Capture real evidence

```bash
python scripts/evidence_probe.py add \
  --ledger completion-evidence.json \
  --requirement REQ-001 \
  --type test \
  --command "dotnet test tests/Auth.Tests/Auth.Tests.csproj" \
  --exit-code 0 \
  --scope focused \
  --paths src/Auth tests/Auth.Tests \
  --result "42 tests passed"
```

### 4. Invalidate stale evidence after later changes

```bash
git diff --name-only <tested-state>..HEAD > changed-after-evidence.txt
python scripts/completion_gate.py freshness \
  --ledger completion-evidence.json \
  --changed-paths-file changed-after-evidence.txt
```

### 5. Gate semantic completion

```bash
python scripts/completion_gate.py gate \
  --ledger completion-evidence.json \
  --policy config/completion-policy.json \
  --report completion-report.json
```

Exit codes:
- `0` complete;
- `2` incomplete or blocked;
- `3` invalid ledger/evidence;
- `4` I/O failure.

Only exit 0 should unlock downstream semantic-success actions.

## Workflow
The primary workflow in [`workflows/workflows.md`](workflows/workflows.md) is:

**Contract → Implement → Observe → Freshness Check → Independent Verify → Gate → Bounded Remediation → Final Verify**

Every retry targets explicit blocking requirement IDs and is bounded by policy. There are no open-ended self-correction loops.

Additional workflows cover stale-evidence recovery and headless/automation exit guarding.

## Skills
[`skills/core-skills.md`](skills/core-skills.md) contains reusable procedures for:
- requirement normalization;
- source-level evidence capture;
- stale-evidence invalidation;
- deterministic completion gating.

Each skill defines trigger, inputs, preconditions, procedure, decisions, constraints, metrics, verification, failure handling, and stop conditions.

## Rules
[`rules/engineering-rules.md`](rules/engineering-rules.md) defines enforceable **MUST / MUST NOT / SHOULD** rules. Core invariants include:
- implementation is not verification;
- “all tests pass” cannot be claimed from a subset;
- process exit 0 is not semantic completion;
- failed or stale evidence cannot be hidden;
- retries are bounded;
- high-risk implementation cannot be self-verified exclusively by its implementer.

## Subagents
[`subagents/subagents.md`](subagents/subagents.md) defines:
- Requirement Contract Agent;
- Implementation Agent;
- Evidence Capture Agent;
- Independent Verification Agent;
- Orchestrator.

Responsibilities intentionally do not overlap at final verification for high-risk changes.

## Hooks
[`hooks/hooks.md`](hooks/hooks.md) defines predictable integration points:
- pre-task contract validation;
- post-validation evidence capture;
- post-change freshness invalidation;
- pre-response completion gating;
- headless process exit guarding;
- final independent verification.

## Metrics
Track at minimum:
- mandatory evidence coverage ratio;
- unsupported verified claims rejected;
- stale evidence invalidated;
- exit-0/nonterminal runs intercepted;
- remediation attempts per task;
- completion-gate pass/fail rate;
- false-block review rate;
- manual rework caused by false completion.

Do not claim improvement until a before/after baseline is measured in the target harness.

## Verification
Run the included contract tests:

```bash
python -m unittest tests/test_completion_gate.py
```

The suite covers:
- known-good completion;
- implemented-but-unverified work;
- claim-only evidence;
- failed tests;
- stale evidence;
- exit 0 while the agent loop is nonterminal;
- duplicate requirement IDs;
- optional incomplete work;
- covered-path freshness invalidation.

See [`verification/report.md`](verification/report.md) for implemented, measured, and verified dimensions plus production rollout guidance.

## Safety
The package is secure-by-default in the following ways:
- it performs local, deterministic ledger checks;
- it never requires secrets;
- it does not execute arbitrary commands itself;
- evidence capture records command metadata supplied by the host rather than executing the command;
- verification criteria are never weakened automatically after failure;
- dangerous or irreversible validation actions require host-level human approval;
- malformed or ambiguous completion evidence fails closed.

Do not store raw secrets in evidence results. Redact sensitive output while retaining enough result semantics to prove success/failure.

## Failure handling
For a failed gate:
1. preserve the current ledger and all negative evidence;
2. return named blocking reasons;
3. retry only if the gap is concretely remediable;
4. increment remediation count;
5. capture new observable evidence;
6. re-run freshness and the gate;
7. stop after the configured maximum;
8. report incomplete/blocked rather than claiming success.

For nonterminal process exits, one safe host-supported resume may be attempted. Do not replay destructive side effects without an idempotency boundary.

## Definition of Done
An integrated task is complete only when:
- the requirement contract includes every material outcome;
- all mandatory requirements are `verified`;
- each mandatory verified requirement has fresh policy-allowed evidence;
- relevant changes after validation have invalidated/replaced old evidence correctly;
- the agent loop is terminal;
- required independent verification is complete;
- the deterministic gate returns exit 0;
- there are no blocking reasons;
- no retry limit or required human approval is unresolved.

## Customization
You can extend the schema and policy with organization-specific evidence types, dependency-aware freshness invalidation, CI artifact links, commit SHAs, service health checks, or signed verifier identities.

Any extension should preserve three principles:
1. **Facts before claims** — evidence comes from observable events.
2. **Freshness before confidence** — old proof cannot certify changed state.
3. **Deterministic gate before “done”** — the final completion signal is machine-checkable, not just persuasive prose.
