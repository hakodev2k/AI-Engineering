# Hook — Pre Terminal Capability Decision

## Trigger
Before `decline`, capability-driven `ask-user`, `workaround`, or `fallback`.

## Preconditions
A registry JSON and a decision record are available.

## Action
Run:
```bash
python scripts/discovery_gate.py --registry config/capabilities.json --task "$TASK" --decision "$DECISION" --loaded "$LOADED_TOOLS" --searched "$SEARCHED_CAPABILITIES"
```

## Expected result
Exit `0`: terminal decision may proceed. Exit `2`: discovery is required. Exit `3`: ambiguous/invalid input requires review.

## Failure behavior
Retry invalid input collection once. If registry/discovery state remains unknown, block an unsupported terminal capability claim and escalate.

## Blocking
Yes for exit `2` or `3`. The hook does not authorize execution of any discovered tool.