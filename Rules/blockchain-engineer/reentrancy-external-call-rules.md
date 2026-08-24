# Reentrancy and External Calls

## Purpose
Prevent unsafe control-flow transfer and state corruption across contract boundaries.

## Scope
Native-value transfers, token callbacks, hooks, arbitrary calls, delegate calls, and cross-contract interactions.

## MUST
- Assume every external call can fail, consume unexpected gas, return malformed data, or reenter unless proven impossible.
- Establish required internal state before yielding control or use an equivalent guarded design.
- Check and handle external-call success according to protocol semantics.
- Bound callback authority and document reentrancy assumptions.
- Test malicious receivers and nested call sequences.

## MUST NOT
- Make untrusted delegate calls without strict target and storage-safety controls.
- Ignore low-level call return values.
- Depend on a recipient being an EOA for safety.

## SHOULD
- Prefer pull-based settlement when it materially reduces interaction risk.

## Exceptions
Intentional reentrancy requires explicit invariants, bounded entry points, adversarial tests, and security approval.

## Verification
Review call graphs, state ordering, guards, low-level call handling, fuzz/invariant tests, and malicious-counterparty test contracts.