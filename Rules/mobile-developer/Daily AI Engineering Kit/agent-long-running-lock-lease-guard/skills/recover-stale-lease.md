# Skill: Recover or Take Over a Stale Lease

## Purpose
Recover a long-running workflow after owner crash/disconnect without allowing two writers to mutate the same protected resource.

## Preconditions
Current lease record, current UTC time, policy, last heartbeat evidence, current resource state, and intended replacement owner are available.

## Procedure
1. Read the lease record without changing it.
2. Prove the lease expiry time is in the past; do not rely only on a missing process heartbeat.
3. Confirm resource state has not already advanced beyond the last checkpoint/known mutation evidence.
4. Run `evaluate-takeover.py`.
5. For high/critical risk, require an independent Lease Recovery Reviewer bound to the exact resource and previous fencing token.
6. For production lock breaking/forced takeover, stop for explicit human approval.
7. Acquire a brand-new lease. The store must issue a strictly greater fencing token.
8. Re-read mutable resource state and re-plan affected work before any mutation.
9. Run mutation gate with the new lease/token.
10. Preserve old lease record/evidence; never rewrite history to make the takeover look continuous.

## Verification
The replacement lease has a greater fencing token; stale owner operations carrying the older token are rejected by mutation adapters/gate; current state has been refreshed.

## Retry policy
Transient read failure: one retry. Takeover attempt: at most one per observed expired lease; if another owner wins first, stop and re-read. No loop waiting to become owner.

## Stop conditions
Cannot prove expiry, heartbeat ambiguity within clock skew, fencing token does not increase, resource advanced unexpectedly, review/approval missing, or conflicting ownership evidence.
