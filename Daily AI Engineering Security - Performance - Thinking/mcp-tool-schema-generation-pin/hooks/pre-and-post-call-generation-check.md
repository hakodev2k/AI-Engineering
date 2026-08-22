# Hook — Pre/Post Call Generation Check

## Trigger
Immediately before tool dispatch and immediately before validating the returned tool result.

## Preconditions
The active generation is complete and each call record can persist generation id and schema hash.

## Action
Pre-dispatch: record current generation and schema hash. Post-response: run `python scripts/schema_generation_guard.py <call-record.json>` before accepting the result.

## Expected result
Exit code 0 and identical dispatch/validation generations and schema hashes.

## Failure behavior
Reject the result as an integrity failure, preserve evidence, and do not retry the side-effecting call automatically.

## Blocking
Yes. A cross-generation result cannot be accepted as verified output.
