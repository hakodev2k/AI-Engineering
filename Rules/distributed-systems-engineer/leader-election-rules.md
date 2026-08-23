# Leader Election Rules

## Purpose
Ensure single-authority coordination remains correct during failures and topology changes.

## Scope
Leader-based coordinators, schedulers, lock services, and replicated state machines.

## MUST
- Leader election MUST use a mechanism with explicit quorum, term, or fencing semantics.
- A newly elected leader MUST establish authority before issuing side effects.
- Stale leaders MUST be prevented from mutating protected state.

## MUST NOT
- MUST NOT implement leadership using unsynchronized wall-clock expiry alone.
- MUST NOT assume process liveness implies leadership authority.

## SHOULD
- Leadership transitions SHOULD expose term, owner, duration, and failure metrics.

## Exceptions
Single-node leadership is allowed only where loss of coordination is explicitly acceptable.

## Verification
Test concurrent candidates, delayed nodes, lease expiry, network partitions, and stale-leader fencing.