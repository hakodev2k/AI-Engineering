# Oracle Data

## Purpose
Prevent stale, manipulated, unavailable, or misinterpreted external data from corrupting protocol decisions.

## Scope
Price feeds, randomness, attestations, bridges, off-chain reporters, and other oracle inputs.

## MUST
- Define freshness, validity, decimal/unit, confidence, and failure requirements for each oracle input.
- Reject or safely degrade on stale, invalid, out-of-range, or unavailable data.
- Analyze manipulation cost relative to protocol value at risk.
- Define behavior during sequencer, provider, or feed outages where applicable.
- Test boundary values and oracle failure modes.

## MUST NOT
- Trust a single mutable off-chain source without explicit risk acceptance.
- Assume oracle values are current merely because a call succeeds.
- Mix units or decimal conventions implicitly.

## SHOULD
- Use independent sources or circuit breakers when concentration risk is material.

## Exceptions
Reduced redundancy requires documented threat model, exposure limit, monitoring, and approval.

## Verification
Inspect feed configuration, freshness checks, unit conversions, outage tests, manipulation analysis, and production monitoring.