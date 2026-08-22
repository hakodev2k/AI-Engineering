# Verification Report

## Scope
Verification target: runtime-enforced aggregate delegation budgets prevent recursive subagent fan-out from exceeding configured descendant, depth, concurrency, token, and tool-call envelopes.

## Implemented
- Root-level budget policy with descendant/depth/concurrency/token/time/tool-call limits.
- Explicit child delegation budget and default-deny recursive delegation semantics.
- Deterministic `budget_guard.py` commands for initialize, plan validation, reservation, reconciliation, threshold checking, and finalization.
- Idempotent spawn request handling.
- Hard-limit denial reasons.
- Soft-threshold and hard-violation states.
- Fan-out trace analyzer for planned-versus-actual descendants/depth/tokens.
- Regression tests for duplicate spawn, concurrency, nested delegation, depth, token reservation, reconciliation, and incomplete finalization.
- Independent verification role and bounded release workflow.

## Measured
Public evidence contains measured incidents used to select the problem, including reports of 48+ descendants, 218 spawned agents/~700k tokens, 361+ descendants/quota exhaustion, and 234 tool calls/>124k tokens. These are external incident measurements, not measurements of this package in the user's production runtime.

The package defines metrics for production comparison:
- actual/planned descendant ratio;
- actual/planned token ratio;
- peak concurrency;
- maximum depth;
- spawn-denial count/reason;
- post-detection token growth;
- partial-result retention;
- reservation estimate error.

## Verified
### Static/invariant verification
Reviewed package logic against these required invariants:
1. every spawn requires parent identity and a reservation;
2. duplicate request IDs do not create another reservation;
3. hard limits are evaluated before reservation persistence;
4. a child without delegation permission cannot spawn;
5. depth is derived from registered parent depth;
6. actual consumed usage is not refunded during reconciliation;
7. active reservations count against concurrency and estimated budgets;
8. unknown/unreconciled work remains reserved;
9. finalization fails while reservations remain active;
10. policy raising is not automated by the scripts.

### Repository persistence verification
A final GitHub tree check is required after README creation. Success must not be reported unless every manifest path is visible on `main`.

### Runtime test status
The repository includes executable Python tests, but this generation environment does not execute code directly from the GitHub connector. Therefore this report does **not** claim that target-runtime tests were executed. Production adoption must run:

```bash
python -m unittest discover -s tests -v
```

and fault/concurrency tests against the real transactional ledger adapter before enforcement is considered production-verified.

## Required target-runtime acceptance
- Unit tests pass.
- Concurrent admission cannot exceed root hard limits.
- Recursive child attempts are denied at configured depth/count.
- Retry of the same spawn request is idempotent.
- Denied spawn never reaches the real spawn API.
- Hard-limit incident freezes new admissions.
- Partial results survive cancellation when available.
- No raw prompts/secrets are required in accounting logs.
- Distributed ledger adapter proves atomic read-check-reserve behavior.

## Failure handling
If any invariant fails: stop rollout, preserve ledger/trace evidence, permit at most two implementation-fix cycles, rerun independent verification, and do not increase hard limits to force a pass.

## Verification status
- **Implemented:** yes.
- **Measured in public incidents:** yes.
- **Statically verified against package invariants:** yes.
- **Persisted to GitHub:** pending final tree check at package completion.
- **Executed in target runtime:** not claimed; required before production enforcement.