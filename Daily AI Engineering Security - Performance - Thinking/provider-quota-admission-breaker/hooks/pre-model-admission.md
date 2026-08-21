# Hook: Pre-Model Admission

## Trigger
Immediately before any network-bound model/provider request is dispatched.

## Preconditions
The request has a normalized resource key or is explicitly marked resource-unknown. Current breaker state can be read atomically.

## Action
Evaluate the request against the current resource state and generation. Return `allow`, `deny`, or `probe` before network I/O.

## Script/command
```bash
python scripts/quota_gate.py decision --state runtime/quota-state.json --request runtime/request.json
```

The same logic SHOULD be embedded in the runtime for production use; the script is a deterministic reference/verifier.

## Expected result
- Open/unknown-unshared resource: `allow`.
- Closed matching resource before reset: `deny`.
- Eligible cooldown expiry with no probe claimed in generation: `probe`.
- Different provider resource or local/MCP work: `allow`.

## Failure behavior
If the state file is unreadable or the decision cannot be made safely, block only the affected provider request and emit a typed admission error. Do not globally cancel unrelated work.

## Blocks completion
Yes, when verification detects a provider request bypassing a closed matching resource or a false-positive denial of unrelated work.