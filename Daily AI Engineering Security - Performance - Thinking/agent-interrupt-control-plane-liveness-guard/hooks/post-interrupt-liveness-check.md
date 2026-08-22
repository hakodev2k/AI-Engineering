# Hook: Post-Interrupt Liveness Check

## Trigger
Immediately after a synthetic or real interrupt lifecycle reaches a terminal state in a test/staging environment.

## Preconditions
- Lifecycle events are written as JSONL.
- `config/policy.json` matches the intended runtime.
- Event collection includes ingress, acknowledgement, cancellation, descendants, side-effect admission, transcript repair, and resume reconciliation where applicable.

## Action
Run the lifecycle guard over the event stream and block verification on deadline, side-effect, orphan, transcript, or resume violations.

## Command
```bash
python3 scripts/interrupt_liveness_guard.py events.jsonl --policy config/policy.json --strict
```

## Expected result
Exit `0`, `decision=effective`, all required lifecycle stages present, no side effects after cancel-pending, and no live descendant after the configured drain deadline.

## Failure behavior
- Invalid/missing evidence: block automated completion.
- Lifecycle invariant violation: block and preserve sanitized event timeline.
- Transient fixture collection failure: retry at most twice.

## Blocking
Yes for runtime changes affecting interrupt/cancellation behavior.

## Notes
This hook validates observable runtime behavior only. It does not request or infer hidden chain-of-thought.
