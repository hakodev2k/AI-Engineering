# Subagent Terminal Outcome Reconciliation Gate

## Topic
Subagent Terminal Outcome Reconciliation Gate

## Category
Thinking

## Problem
Multi-agent runtimes can confuse parent orchestration status with objective task completion. A run may claim success before required subagents actually execute, or report interruption/failure after a child already produced useful durable work. Blindly trusting the parent label causes unsupported conclusions, lost work, unnecessary retries, and possible duplicate effects.

## Evidence
`evidence/research.md` documents current public reports from Claude Code Action and Hermes Agent showing false-completion and interrupted-result failure modes. The evidence supports an observable lifecycle-reconciliation problem, not a request for hidden chain-of-thought.

## Existing approach
Typical systems trust parent exit status, final model text, child tool return values, cancellation propagation, or retry from scratch.

## Existing limitations
These signals do not prove that required delegated work ran, reached a terminal state, or satisfied task acceptance criteria. Cancellation can hide already-produced artifacts, while parent success can be published before child dispatch completes.

## Proposed improvement
Maintain an explicit expected-child set and reconcile it with a durable child lifecycle registry before accepting terminal status. Require start evidence, terminal receipts, and independent acceptance evidence for required children. Preserve interrupted work, distinguish unknown commit state from failure, and use bounded recovery rather than blind retry.

## Architecture
`scripts/reconcile_outcomes.py` provides deterministic terminal mapping. `skills/outcome-reconciliation.md` defines the evidence procedure, `rules/terminal-outcome-invariants.md` defines enforceable completion rules, the two workflows separate normal terminal reconciliation from interruption recovery, and `subagents/outcome-verifier.md` independently verifies high-impact outcomes.

## Actual package tree
```text
subagent-terminal-outcome-reconciliation-gate/
├── README.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── examples/
│   └── run.json
├── hooks/
│   └── pre-success-gate.md
├── rules/
│   └── terminal-outcome-invariants.md
├── scripts/
│   └── reconcile_outcomes.py
├── skills/
│   └── outcome-reconciliation.md
├── subagents/
│   └── outcome-verifier.md
├── tests/
│   └── outcome-fixtures.json
└── workflows/
    ├── interruption-recovery.md
    └── terminal-reconciliation.md
```

## Installation
Requires Python 3.9+ with no third-party dependencies.

## Configuration
`config/policy.json` defines lifecycle state classes and required evidence. Keep terminal-receipt, start-evidence, and acceptance-evidence requirements enabled for required children unless an equivalent deterministic evidence source replaces them.

## Usage
Run the gate before publishing parent success:

```bash
python3 scripts/reconcile_outcomes.py examples/run.json --policy config/policy.json
```

Exit codes:

- `0`: `verified_success`
- `10`: `partial`
- `20`: `reconcile`
- `30`: `failed` or `blocked`
- `2`: invalid input or policy

Use `hooks/pre-success-gate.md` to make every nonzero result block terminal success.

## Workflow
Normal path: `workflows/terminal-reconciliation.md`.

**Observe parent/child state → query durable lifecycle evidence → classify each required child → run acceptance checks → reconcile ambiguity → map objective outcome → independently verify high-impact completion.**

Interrupted path: `workflows/interruption-recovery.md` first freezes blind retry, inspects durable work, runs acceptance on existing artifacts, and permits replacement only after prior execution state is known.

## Metrics
Track:
- false-success rate;
- false-failure rate;
- required-child terminal-evidence coverage;
- required-child acceptance-evidence coverage;
- interrupted work recovered instead of rerun;
- duplicate retries prevented;
- reconciliation latency;
- unresolved/blocked terminal outcomes.

## Verification
`tests/outcome-fixtures.json` specifies deterministic regression cases:

- all required children completed and accepted => verified success;
- parent success with a required child that never started => reconcile;
- interrupted child whose preserved work passes acceptance => verified success despite parent interruption;
- interrupted child with unknown commit state => reconcile, never blind retry;
- explicit required-child failure => failed;
- unresolved child after retry budget => blocked.

Integration tests should additionally simulate a parent process ending immediately after narrating planned child dispatch and verify success is blocked when no child start record exists. A second scenario should interrupt a child after artifact creation and prove existing work is evaluated before a replacement child is scheduled.

## Safety
- The package does not inspect or request hidden chain-of-thought.
- Objective status relies on lifecycle records, artifacts, tests, and receipts.
- Unknown committed work blocks automatic retry.
- Known artifacts are preserved during recovery.
- Acceptance requirements are never weakened to transform interruption into success.
- High-impact recovered outcomes should be independently verified.

## Failure handling
### Detection
Missing required child, absent start evidence, child still running, missing terminal receipt, failed acceptance, explicit failure state, interrupted child, or unknown commit state.

### Evidence
Preserve child IDs, lifecycle timestamps/statuses, terminal receipt references, sanitized commit-state references, artifact/test evidence, and parent/child cancellation lineage.

### Retry policy
Lifecycle/evidence reconciliation is attempted at most twice. Delegated execution itself is not retried while prior commit state is unknown.

### Fallback
Return `partial` or `reconcile` and preserve existing work. A verified equivalent fallback child may satisfy the objective only when it passes the same acceptance criteria.

### Escalation
After the reconciliation budget is exhausted, return `blocked` and require a higher-level recovery decision for unresolved high-impact work.

### Stop condition
Stop on conclusive verified success/failure or after the configured bounded reconciliation attempts.

## Implemented, Measured, Verified
- **Implemented:** evidence model, policy, deterministic reconciliation script, skill, enforceable rules, independent verifier, normal/recovery workflows, blocking hook, example, and fixtures are present.
- **Measured:** the package defines measurable false-success/false-failure/retry/recovery metrics; production improvement must be measured in the target orchestrator rather than assumed.
- **Verified:** deterministic expected outcomes and integration acceptance scenarios are defined. Target-runtime verification requires those lifecycle scenarios to pass using the real child registry and artifact/receipt stores.

## Definition of Done
A deployment is complete only when:

- the required child set is explicit;
- required children have lifecycle start evidence;
- terminal success cannot bypass terminal receipts;
- task acceptance is checked independently of child self-report;
- interruption does not erase durable child work;
- unknown commit state prevents blind replacement/retry;
- regression fixtures and integration scenarios pass;
- before/after metrics are captured;
- high-impact outcomes receive independent verification;
- no blocking lifecycle ambiguity remains.

## Customization
Map framework-specific lifecycle states into `config/policy.json`, adapt child records to the JSON input contract, and replace boolean acceptance values with results from your deterministic tests, artifact validators, deployment checks, or business postconditions. Keep objective acceptance separate from parent orchestration status.
