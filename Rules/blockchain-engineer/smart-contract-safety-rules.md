# Smart Contract Safety

## Purpose
Prevent irreversible contract defects and unsafe state transitions.

## Scope
Smart contracts and protocol logic that can control assets, permissions, or durable state.

## MUST
- Define invariants for balances, ownership, authorization, and lifecycle transitions before implementation.
- Validate every externally supplied value before it influences state.
- Apply checks-effects-interactions or an equivalently justified reentrancy defense where external calls occur.
- Make privileged state transitions explicit and auditable.
- Add tests for invariant violations, adversarial call ordering, and failure paths.

## MUST NOT
- Assume an external contract behaves honestly or conforms perfectly to an interface.
- Leave asset-moving or privilege-changing paths without negative tests.
- Treat successful compilation as evidence of contract safety.

## SHOULD
- Minimize mutable state and externally callable surface area.
- Prefer simple, reviewable mechanisms over clever gas-saving constructions unless measurements justify complexity.

## Exceptions
Any deviation requires documented rationale, threat analysis, alternatives, tests, and reviewer approval.

## Verification
Review invariants, static-analysis findings, unit/fuzz/invariant tests, call graphs, and audit evidence before release.