# Consumer Reliability

## Purpose
Keep consumption correct during crashes, rebalances, retries, and slow dependencies.

## Scope
Acknowledgements, offsets, concurrency, graceful shutdown, and poison messages.

## MUST
- Consumers MUST define when work is considered complete relative to acknowledgement or offset commit.
- Shutdown MUST stop intake and safely finish or abandon in-flight work according to delivery semantics.
- Rebalance and restart behavior MUST be tested for duplicate and loss scenarios.

## MUST NOT
- MUST NOT swallow processing failures and advance progress when business processing failed.
- MUST NOT use unbounded in-flight work.

## SHOULD
- Separate consumption from slow downstream work when buffering semantics remain explicit and durable.

## Exceptions
Document semantic impact, safeguards, and approval.

## Verification
Crash consumers mid-processing, force rebalances, inspect commits, and reconcile resulting state.