# Hooks

## Hook — Pre Tool Classification
**Trigger:** tool registration/startup.
**Action:** ensure every tool has effect class and identity strategy.
**Command:** `python scripts/idempotency_guard.py validate-registry --registry examples/tool-registry.json`
**Expected:** exit 0 and no unclassified writes.
**Failure:** block production registration for unknown-effect tools.

## Hook — Pre Write Reservation
**Trigger:** immediately before side-effecting provider call.
**Action:** canonicalize identity and reserve operation key atomically.
**Command:** call guard library/CLI `reserve` against durable ledger.
**Expected:** status `owner`, `completed`, or `in_progress`; never uncontrolled execution.
**Failure:** fail closed for write if ledger is unavailable or identity invalid.

## Hook — Completed Replay
**Trigger:** reservation lookup returns `completed`.
**Action:** return persisted result/reference without provider invocation.
**Expected:** suppression metric increments.
**Failure:** if result reference is corrupt, reconcile rather than execute blindly.

## Hook — Ambiguous Failure
**Trigger:** timeout, connection reset, worker termination, or response loss after dispatch.
**Action:** set state `unknown`; invoke reconciliation workflow.
**Expected:** retry only after provider confirms no effect.
**Failure:** bounded attempts then human escalation for risky writes.

## Hook — Lease Expiry
**Trigger:** contender sees stale `in_progress` reservation.
**Action:** reconcile prior attempt before lease takeover.
**Expected:** no second provider call when original already succeeded.
**Failure:** retain `unknown` and stop automatic execution if outcome cannot be established.

## Hook — Post Completion
**Trigger:** provider confirms success.
**Action:** hash/store compact result, mark ledger completed, record provider request identifier and metrics.
**Expected:** subsequent duplicate is a cache-like completed hit.
**Failure:** if completion persistence fails after provider success, mark/recover via reconciliation; do not immediately repeat provider call.

## Hook — Release Verification
**Trigger:** code/policy change.
**Action:** run `python tests/test_idempotency_guard.py` and service-specific crash/concurrency tests.
**Expected:** zero duplicate effects in fixtures.
**Failure:** block rollout.
