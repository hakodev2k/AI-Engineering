# Integration Guide

## Integration boundary

Treat the progress ledger as orchestration state, not as free-form model memory. The host should own persistence, sequence allocation, timestamps, and approval references. The model may propose transitions, but the host validates them before append.

## Minimal integration

1. Copy `config/ledger-policy.json`, `schemas/progress-ledger.schema.json`, and `scripts/ledger_guard.py` into the agent harness repository.
2. Convert the approved plan into a JSON task array with stable IDs, titles, mandatory flags, and acceptance criteria.
3. Compute the canonical baseline hash:

```bash
python scripts/ledger_guard.py hash --tasks approved-tasks.json
```

4. Create a ledger containing `run_id`, `policy_version`, `baseline.sha256`, `baseline.tasks`, an empty `events` array, and risk classification.
5. Run `validate` before allowing implementation.
6. For every progress update, let the host append one event and immediately validate the full ledger.
7. Run `gate` before any final success signal.

## Suggested event-writing contract

The implementation agent should request transitions with a small structured payload:

```json
{
  "task_id": "TASK-003",
  "expected_from": "in_progress",
  "to": "completed",
  "reason": "Implementation and focused regression complete",
  "evidence": ["ci://run/81234/test-auth", "git://HEAD:src/Auth"]
}
```

The host should:

- verify `expected_from` against replayed state;
- allocate the next sequence number;
- set the timestamp itself;
- set actor identity from authenticated orchestration context;
- require an approval reference for mandatory cancellation;
- append only after validation.

Do not let the model choose a past sequence number or rewrite historical events.

## Storage recommendations

Best: host-owned datastore or file path outside the implementation agent's write permission. Good: repository file protected by a pre-write hook and dedicated writer. Minimum: a tracked ledger plus baseline snapshot committed before autonomous execution.

For CI, upload the final ledger and gate report as artifacts even on failure. For local agents, keep the ledger beside session metadata but deny general shell/edit tools direct write access when possible.

## Plan changes during execution

Do not rewrite the sealed baseline. When a legitimate new requirement appears:

1. pause execution;
2. record the requested amendment in a host log;
3. obtain approval for scope-changing mandatory work where required;
4. create a new stable task ID;
5. either start a new baseline version or maintain an explicit amendment record in the host layer;
6. preserve the original baseline and hash for audit continuity.

This package intentionally keeps the provided schema simple; systems that need mid-run amendments should extend it with signed/approved amendment objects rather than overwriting `baseline.tasks`.

## GitHub Actions integration

Use the gate as a final job step after tests/builds. The AI action may finish with process exit 0, but downstream release/merge automation should depend on `ledger_guard.py gate` exit 0 instead of the agent process alone.

Example shell logic:

```bash
python scripts/ledger_guard.py gate \
  --ledger .agent/progress-ledger.json \
  --policy config/ledger-policy.json
```

Any exit 2 means the work is semantically incomplete or violates ledger policy. Exit 3 means malformed input/policy. Exit 4 means I/O failure. None should be converted to success automatically.

## Multi-agent integration

Use a single host writer. Subagents should return proposed transitions and evidence; they should not append directly in parallel. This prevents sequence races and makes actor attribution reliable. The orchestrator serializes accepted events after checking the current derived state.

For high-risk changes, ensure the `verifier` represents a genuinely independent reviewer role/session, not simply a renamed invocation of the same implementer context.

## Human approval

Mandatory cancellation is the key human decision boundary. Approval should be explicit and durable, for example a GitHub review URL, issue comment ID, internal approval event ID, or signed orchestration event. Do not store credentials, access tokens, or raw sensitive messages in the ledger.

## Operational metrics

Capture per run:

- baseline task count and mandatory count;
- number of accepted/rejected transitions;
- count of mandatory cancellations and approval coverage;
- pending-at-stop interceptions;
- baseline hash mismatches;
- reconciliation retries;
- false-block reviews;
- incidents where human review found work missing despite a passing gate.

The last metric matters: a deterministic ledger can protect obligation continuity, but it cannot prove that every original requirement was decomposed correctly. Periodically audit baseline quality.

## Rollout

Start in observe-only mode for a sample of long-running tasks to measure how often agents attempt to stop with unresolved items. Then enable blocking for mandatory-task disappearance, hash drift, invalid transitions, and evidence-free completion. Keep policy changes versioned and reviewed. Never auto-relax policy after a failed run.