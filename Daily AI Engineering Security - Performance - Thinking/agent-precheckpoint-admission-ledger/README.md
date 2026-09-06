# Agent Pre-Checkpoint Admission Ledger

**Category:** Thinking  
**Run date:** 2026-09-06 (UTC+7)

## Problem
Asynchronous agent work can be acknowledged by an API, queue, scheduler, or parent agent before the workflow runtime writes its first durable checkpoint. A crash in that gap can leave no resumable state and no durable failure record, so accepted work silently disappears.

## Evidence
`evidence/research.md` documents a fresh LangGraph reproduction opened on 2026-08-30 showing process death before the first checkpoint leaves zero durable checkpoints and no resumable state. Other 2026 LangGraph reports cover checkpoint flush loss and deterministic crash/resume guarantees. Official LangGraph documentation confirms that execution without checkpoint persistence cannot recover mid-run.

## Existing approach
Workflow checkpointers, synchronous durability settings, queues, retries, job tables, and idempotency keys improve reliability after state exists.

## Existing limitations
The acceptance boundary may still precede the first resumable workflow state. Recovery with no checkpoint cannot distinguish work that was never admitted from work that was durably accepted and then lost. Blind retry can also duplicate external effects.

## Proposed improvement
Persist a minimal external admission record before acknowledging asynchronous work. Track a strict lifecycle (`accepted` → `checkpointed` → terminal), record stable run/idempotency IDs and an input hash, reconcile stale pre-checkpoint admissions as `lost`, and permit automatic replay only when side-effect freedom or idempotency is verified.

## Architecture
The analysis skill locates the acceptance/checkpoint gap. Rules define observable lifecycle invariants. `admission_ledger.py` provides a durable SQLite reference implementation with WAL and `synchronous=FULL`. The pre-run hook places the admission write before acknowledgement. The workflow measures baseline, injects controlled crashes, and uses bounded recovery. An independent verifier checks crash/recovery behavior.

## Package tree
```text
agent-precheckpoint-admission-ledger/
├── README.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── pre-run-admission-gate.md
├── rules/
│   └── durable-admission-rules.md
├── scripts/
│   └── admission_ledger.py
├── skills/
│   └── admission-durability-analysis.md
├── subagents/
│   └── recovery-verifier.md
├── tests/
│   └── test_admission_ledger.py
└── workflows/
    └── admission-checkpoint-recovery.md
```

## Installation
Requires Python 3.10+ and only the standard library. SQLite is included with normal Python distributions. For production, place the ledger on storage with durability/failover characteristics appropriate to the acknowledgement guarantee; the local SQLite implementation is a reference for single-host or embedded use.

## Configuration
`config/policy.json` defines the default loss timeout, bounded reconciliation retries, idempotency requirement, and side-effect-free replay rule. Integrations should load equivalent values into their runtime. Do not store prompts or secrets in the ledger.

## Usage
Run deterministic tests:

```bash
python3 tests/test_admission_ledger.py
```

Create a ledger and admit a run before caller acknowledgement:

```bash
python3 scripts/admission_ledger.py --db runtime/admissions.sqlite init
python3 scripts/admission_ledger.py --db runtime/admissions.sqlite admit \
  --run-id run-123 --idempotency-key request-456 --input-hash sha256:abc
```

Mark first resumable state and completion:

```bash
python3 scripts/admission_ledger.py --db runtime/admissions.sqlite checkpoint --run-id run-123 --checkpoint-id cp-1
python3 scripts/admission_ledger.py --db runtime/admissions.sqlite complete --run-id run-123
```

Reconcile pre-checkpoint admissions:

```bash
python3 scripts/admission_ledger.py --db runtime/admissions.sqlite reconcile --lost-after-seconds 120
```

A reconciliation that marks one or more runs `lost` exits `2` so automation cannot silently ignore the condition.

## Workflow
Follow `workflows/admission-checkpoint-recovery.md`: Observe → Measure baseline → Diagnose → Form hypothesis → Implement durable admission → Measure again → bounded remediation → reconcile → recovery decision → independent verification.

## Metrics
- Admission-to-first-checkpoint p50/p95/p99.
- Accepted-without-checkpoint count and rate.
- Lost-run rate.
- Reconciliation latency.
- Stable idempotency-key coverage.
- Duplicate-side-effect rate after recovery.
- Recovery success rate.

## Verification
### Implemented
The package includes the lifecycle rules, durable admission ledger, gate hook, crash-boundary analysis skill, bounded workflow, tests, policy, and independent verifier contract.

### Measured
Deployments must capture baseline/post-change admission-to-checkpoint metrics and crash outcomes. The included tests measure admission persistence, idempotent re-admission, conflict rejection, checkpoint/completion transitions, terminal-state non-regression, and fresh-run reconciliation safety.

### Verified
A deployment is verified only when a controlled pre-checkpoint crash cannot disappear silently; every acknowledged run has a durable admission record; first checkpoint state is observable; terminal states cannot regress; and potentially side-effecting lost runs require human review rather than automatic replay.

## Safety
Use crash injection only in isolated test environments. Never terminate production workers solely to validate this package. Do not weaken idempotency, approval, persistence, or checkpoint guarantees to achieve a passing test. Keep raw secrets and prompt bodies out of the ledger.

## Failure handling
Detection: ledger write failure, ID conflict, stale `accepted` record, illegal state transition, or recovery ambiguity. Evidence: ledger row, checkpoint/run IDs, sanitized logs, timestamps. Retry: at most two remediation iterations; no automatic replay for ambiguous side-effecting work. Fallback: acknowledge only after first checkpoint or disable asynchronous admission. Escalation: workflow/platform owner. Stop condition: any accepted run can still disappear or recovery can duplicate an irreversible effect without approval.

## Definition of Done
- Current evidence documented.
- Acceptance and first-checkpoint boundaries mapped.
- Baseline captured.
- Durable admission occurs before acknowledgement.
- Stable run/idempotency IDs enforced.
- Tests pass.
- Crash/recovery metrics collected.
- Before/after comparison complete.
- Risks and side effects classified.
- Required approvals enforced.
- Independent verification complete.
- No accepted run can silently disappear.

## Customization
Replace SQLite with a transactional database or durable queue when distributed availability is required, while preserving the lifecycle semantics and acknowledgement ordering. Integrate the runtime's real checkpoint ID into the `checkpoint` transition. Tune `lost_after_seconds` from measured checkpoint latency distributions rather than intuition.
