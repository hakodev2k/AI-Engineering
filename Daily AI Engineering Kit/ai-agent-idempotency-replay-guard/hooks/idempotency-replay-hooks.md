# Hooks: Idempotency & Replay

## Pre-mutation manifest validation
- Trigger: before any mutating tool call.
- Preconditions: operation manifest and policy exist.
- Action: `python scripts/validate_operation_manifest.py --manifest <manifest> --policy config/replay-policy.json`
- Expected result: exit 0.
- Failure: block execution.
- Blocking: yes.

## Pre-mutation replay gate
- Trigger: immediately before initial call, retry, or resume.
- Action: `python scripts/evaluate_replay_gate.py --manifest <manifest> --ledger <ledger> --policy config/replay-policy.json`
- Expected result: decision is `execute`, `safe-retry`, or `reuse-success`.
- Failure: `review-required` or `blocked` prevents mutation.
- Blocking: yes.

## Post-dispatch ledger append
- Trigger: after dispatch result or exception is known.
- Action: append an immutable event with attempt, timestamp, request ID when available, status, evidence path, and result fingerprint.
- Expected result: event persisted without overwriting prior evidence.
- Failure: stop additional mutation/retry until ledger persistence is restored.
- Blocking: yes.

## Final verification
- Trigger: before declaring task complete.
- Action: rerun replay gate and confirm latest state is `succeeded` or valid `reuse-success`, plus provider/business evidence.
- Expected result: exactly one verified business effect for the operation key.
- Failure: report executed-but-unverified or blocked; never report verified success.
