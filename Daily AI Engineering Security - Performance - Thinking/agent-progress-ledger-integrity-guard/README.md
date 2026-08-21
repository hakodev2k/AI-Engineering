# Agent Progress Ledger Integrity Guard

## Topic
Tamper-evident progress tracking for long-running AI coding agents.

## Category
**Thinking**

## Problem
Long-running coding agents increasingly use plans, todos, epics, checklists, issue comments, or local tracking documents as the human-visible control plane for progress. That control plane becomes unreliable when the same agent can freely delete open work, rewrite task identities, mark incomplete items complete, or stop while pending obligations remain.

The core problem is not merely poor planning. It is a reasoning-control failure: **the artifact used to evaluate progress can itself be mutated by the actor being evaluated**. Once obligations disappear from the tracker, a final summary can look internally consistent even though required work was never completed.

This package makes progress state auditable through a sealed obligation baseline, stable task IDs, append-only state transitions, deterministic reconciliation, explicit cancellation approval, and a pre-stop completion gate.

## Evidence
Current public evidence is summarized in [`evidence/research.md`](evidence/research.md). Important signals include:

- Anthropic Claude Code issue #41109 (2026-03-30), reporting removal of open tasks and false completion status in a project-tracking artifact;
- `anthropics/claude-code-action` issue #599, reporting automated runs that stop with pending todos and validation steps unfinished;
- Claude Code issue #6159, describing agents stopping mid-plan while their own todo lists remain incomplete;
- Claude Code feature request #34535, describing an independent peer-audit workflow used to reduce single-model completion blind spots;
- open-source orchestration projects that add external continuation/state mechanisms so the agent cannot simply stop while todos remain.

The research file explicitly separates observed evidence, interpretation, and this package's proposed engineering solution.

## Existing approach
Typical systems use one or more of:

- prompt rules such as “continue until all todos are complete”;
- mutable todo tools or Markdown tracking files;
- final-response self-review;
- stop hooks that inspect current pending items;
- Git history for tracked artifacts;
- independent reviewer agents;
- completion/evidence gates.

## Existing limitations
Prompt rules depend on model compliance. Mutable trackers can lose obligations. Stop hooks are only as trustworthy as the task list they inspect. Git history does not help for in-memory or untracked state unless explicitly captured. Independent reviewers may see only the already-mutated tracker. Completion evidence gates prove claims, but they do not necessarily preserve the continuity of the original obligation set.

The remaining gap is **progress-ledger integrity**: retain what was approved, make transitions auditable, and ensure the denominator of “work complete” cannot silently shrink.

## Proposed improvement

```text
Approved requirements
        |
        v
Stable task IDs + mandatory classification
        |
        v
Canonical baseline SHA-256  ---- immutable run baseline
        |
        v
Append-only transition events
        |
        +--> validate every transition
        |
        +--> completed requires evidence
        |
        +--> mandatory cancellation requires approval
        v
Derived current state
        |
        v
Repo/test/evidence reconciliation
        |
        v
Independent verify for high risk
        |
        v
Deterministic pre-stop gate
   | pass             | fail
   v                  v
 complete       bounded remediation
                    |
                    v
              incomplete/blocked
```

The package never requests or stores hidden chain-of-thought. It works only with inspectable artifacts: task IDs, acceptance criteria, state transitions, actors, timestamps, evidence references, approvals, repository/test state, and final gate results.

## Architecture

### 1. Sealed obligation baseline

Every material task gets a stable ID before execution. The ordered baseline task array is canonicalized and hashed with SHA-256. Silent deletion or modification of a baseline task changes the digest and blocks validation.

### 2. Append-only event stream

The current progress view is derived from transition history. Prior valid events are not edited to repair later mistakes. This makes status changes replayable and exposes illegal lifecycle changes.

### 3. Transition policy

[`config/ledger-policy.json`](config/ledger-policy.json) defines allowed states and transitions. By default:

- `pending -> in_progress|blocked|cancelled`;
- `in_progress -> blocked|completed|cancelled`;
- `blocked -> in_progress|cancelled`;
- terminal states do not transition further.

Direct `pending -> completed` is rejected, completion requires evidence, and mandatory cancellation requires explicit approval.

### 4. Deterministic integrity gate

[`scripts/ledger_guard.py`](scripts/ledger_guard.py) validates:

- baseline hash;
- duplicate/unknown task IDs;
- monotonic event sequence;
- `from` state consistency;
- policy-allowed transitions;
- completion evidence;
- mandatory cancellation approval;
- unresolved mandatory tasks;
- independent verifier presence for high-risk runs.

### 5. Independent verification

The implementation agent does not own the final truth of high-risk progress. [`subagents/subagents.md`](subagents/subagents.md) separates contract creation, implementation, ledger reconciliation, independent verification, and orchestration.

## Package structure

```text
agent-progress-ledger-integrity-guard/
├── README.md
├── guide-intergration.md
├── config/
│   └── ledger-policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── hooks.md
├── rules/
│   └── engineering-rules.md
├── schemas/
│   └── progress-ledger.schema.json
├── scripts/
│   └── ledger_guard.py
├── skills/
│   └── core-skills.md
├── subagents/
│   └── subagents.md
├── tests/
│   └── test_ledger_guard.py
└── workflows/
    └── workflows.md
```

## Installation

Python 3.10+ is recommended. The script uses only the Python standard library.

Copy the package into the repository or orchestration layer that owns agent execution. Keep the ledger in host-controlled storage when possible rather than a path the implementation agent can freely rewrite.

No secrets are required.

## Configuration

Edit [`config/ledger-policy.json`](config/ledger-policy.json) to match your lifecycle. Preserve these core invariants unless there is a reviewed architectural reason not to:

- stable IDs;
- sealed baseline hash;
- append-only history;
- no silent deletion;
- explicit mandatory cancellation approval;
- evidence-backed completion;
- bounded reconciliation retries;
- independent high-risk verification.

Version policy changes and record the policy version in every ledger.

## Usage

### 1. Prepare approved tasks

Create a JSON array or `{ "tasks": [...] }` containing stable task IDs, titles, mandatory flags, and acceptance criteria.

### 2. Seal the baseline

```bash
python scripts/ledger_guard.py hash --tasks approved-tasks.json
```

Store the returned SHA-256 in `baseline.sha256` beside the exact task array.

### 3. Validate before execution

```bash
python scripts/ledger_guard.py validate \
  --ledger progress-ledger.json \
  --policy config/ledger-policy.json
```

### 4. Append transitions through the host

The model proposes transitions; the orchestration host should allocate sequence number/timestamp and append the event only after policy validation. A completion event should reference real evidence such as a CI run, test artifact, commit/ref, or inspection record.

### 5. Gate final completion

```bash
python scripts/ledger_guard.py gate \
  --ledger progress-ledger.json \
  --policy config/ledger-policy.json
```

Exit codes:

- `0` — validation/gate passed;
- `2` — policy violation or unresolved mandatory work;
- `3` — invalid structured input/policy;
- `4` — I/O/read failure.

Only exit 0 should unlock downstream semantic-success actions.

## Workflow

The primary workflow in [`workflows/workflows.md`](workflows/workflows.md) is:

**Contract -> Seal -> Execute -> Append -> Validate -> Reconcile -> Independently Verify -> Gate -> Bounded Remediation -> Complete/Blocked**

Additional workflows cover premature-stop interception and suspected tracker-manipulation recovery.

Every remediation loop is bounded. The system never retries indefinitely and never makes a failing gate pass by deleting obligations or weakening policy.

## Skills

[`skills/core-skills.md`](skills/core-skills.md) provides complete reusable procedures for:

- sealing an approved obligation baseline;
- append-only progress transition recording;
- pre-stop reconciliation;
- suspected ledger-tampering investigation and recovery.

Each skill defines triggers, inputs, required context, tools, decisions, constraints, metrics, verification, failure handling, and stop conditions.

## Rules

[`rules/engineering-rules.md`](rules/engineering-rules.md) defines enforceable **MUST / MUST NOT / SHOULD** requirements. The most important rules are:

- unfinished work cannot disappear;
- stable task IDs cannot be repurposed;
- prior events cannot be rewritten to repair history;
- mandatory cancellation requires approval;
- failed verification cannot be hidden by shrinking scope;
- final summaries are not the progress source of truth;
- the implementing agent cannot solely verify high-risk work.

## Hooks

[`hooks/hooks.md`](hooks/hooks.md) defines:

- pre-task baseline seal;
- post-transition integrity validation;
- pre-stop/pre-final-response gate;
- baseline drift detection;
- high-risk independent verification;
- final audit preservation.

These hooks are intentionally deterministic where possible.

## Metrics

Track at minimum:

- baseline mandatory-task count;
- illegal transitions rejected;
- sequence/hash integrity failures;
- pending-at-stop interceptions;
- mandatory cancellations and approval coverage;
- completion events without evidence rejected;
- reconciliation attempts per run;
- false-block review rate;
- human-discovered missing work after a passing gate.

The final metric prevents the ledger from becoming a false sense of safety. This package protects continuity of declared obligations; teams must still measure how completely requirements were decomposed into the baseline.

## Verification

Run the supplied regression suite:

```bash
python -m unittest tests/test_ledger_guard.py
```

The tests cover:

- valid complete lifecycle;
- pending mandatory task blocking final stop;
- completion without evidence;
- mandatory cancellation without approval;
- approved cancellation;
- baseline task removal/hash drift;
- unknown replacement task IDs;
- event sequence gaps;
- illegal direct completion;
- high-risk independent verifier requirement;
- duplicate baseline IDs.

### Implemented

The package implements baseline hashing, transition replay, transition-policy enforcement, evidence/cancellation checks, high-risk verifier gating, reusable workflows/hooks/rules, and regression tests.

### Measured

The included tests deterministically measure whether known integrity-violation fixtures are rejected. Production before/after rates are environment-specific and must be collected after integration.

### Verified

A deployment should only claim verified improvement after the regression suite passes and a rollout sample shows that pending-at-stop or ledger-manipulation incidents are intercepted without unacceptable false blocks.

## Safety

- No arbitrary commands are executed by `ledger_guard.py`.
- No credentials are required.
- Approval fields should contain opaque audit references, not secrets.
- The script fails closed on malformed state or policy violation.
- Existing negative evidence is preserved rather than removed.
- Mandatory requirements are never auto-downgraded after failure.
- Dangerous validation or rollback actions remain subject to the host's normal human-approval boundary.
- A corrupted baseline should block the run rather than trigger automatic reconstruction from an untrusted model summary.

## Failure handling

### Illegal transition
Reject the event, retain the last valid ledger, record the rejected attempt in host audit logs, and return the specific task/reason.

### Baseline hash mismatch
Freeze writes, preserve evidence, compare against the approved source, and run the recovery workflow. If the approved baseline cannot be reconstructed with confidence, require human re-approval.

### Pending tasks at stop
Continue only on named unresolved task IDs and only within the configured retry bound. On exhaustion, report incomplete instead of success.

### Missing mandatory cancellation approval
Block until approval arrives or the task resumes. Never invent an approval reference.

### High-risk verifier unavailable
Leave the run blocked or escalate to a human verifier. Do not let the implementer self-certify.

## Definition of Done

A run protected by this package is complete only when:

- the approved task baseline exists with stable IDs;
- baseline SHA-256 validates;
- the event stream is sequence-valid and replayable;
- every accepted transition is policy-valid;
- no mandatory baseline task has silently disappeared;
- every mandatory task is `completed` with required evidence or explicitly `cancelled` with required approval;
- repository/test state has been reconciled against progress state;
- high-risk independent verification is recorded when required;
- reconciliation retry limits are not exceeded;
- the deterministic gate exits 0;
- no blocking integrity issue remains.

## Customization

You can extend the schema and host layer with:

- signed events or append-only database storage;
- task split/merge lineage;
- baseline amendment objects;
- commit-SHA-bound evidence;
- authenticated actor identities;
- organization-specific approval providers;
- CI artifact links;
- dependency-aware verification invalidation;
- dashboards for progress-integrity metrics.

Any extension should preserve the core principle: **progress must be derived from a durable record of the obligations that existed, not from a mutable story about what remains.**

## Schema example

`examples/progress-ledger.example.json` is a synthetic instance of `schemas/progress-ledger.schema.json` for contract smoke tests. It contains no production data and demonstrates shape only; validate it with the package's documented checker or a Draft 2020-12 JSON Schema validator before adapting it.
