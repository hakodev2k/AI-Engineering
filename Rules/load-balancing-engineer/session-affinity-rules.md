# Session Affinity Rules

## Purpose
Use stickiness only when required and prevent affinity from hiding architectural or capacity problems.

## Scope
Cookie affinity, source-IP affinity, consistent hashing, stateful sessions, and shard affinity.

## MUST
- Affinity MUST have a documented requirement and defined behavior when the selected backend becomes unavailable.
- Affinity keys MUST be stable enough for the intended purpose and safe from unauthorized manipulation where security matters.
- Capacity analysis MUST account for uneven distribution caused by sticky sessions.
- Affinity changes MUST be tested for session continuity and rebalance behavior.

## MUST NOT
- MUST NOT introduce affinity merely to compensate for accidental server-local state without evaluating stateless alternatives.
- MUST NOT use source IP as a reliable user identity.
- MUST NOT allow affinity to keep sending traffic to an unhealthy backend.

## SHOULD
- Prefer stateless services where practical.
- Prefer bounded, observable affinity mechanisms with graceful fallback.

## Exceptions
Strong state locality requirements may justify affinity when alternatives, failure behavior, and operational risks are documented.

## Verification
Inspect distribution skew, failover behavior, cookie/key integrity, backend health interaction, and session continuity tests.