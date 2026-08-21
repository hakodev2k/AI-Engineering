# Verification Report

## Status model
This package distinguishes **Implemented**, **Measured**, and **Verified**.

## Implemented
- Central policy file with fail-closed default.
- Canonical capability classification independent of transport.
- Operation digest and scoped approval-token binding.
- Adapter inventory command with non-zero exit for uncovered side-effect routes.
- Deterministic decisions: ALLOW, DENY, REQUIRE_APPROVAL.
- Bounded approval requirements and explicit no-responder failure path in rules/workflows.
- Route-equivalence, stale-token, argument/target mutation, annotation-lie and unknown-capability tests.

## Measured
The reference logic was executed against the package's core invariants during generation. The route-equivalence check returned REQUIRE_APPROVAL for the same destructive capability through terminal, MCP, subagent and docker-style transports. Exact scoped approval allowed the unchanged operation; changed target invalidated the approval; unknown capability denied; read-only capability allowed.

Production measurements are intentionally not fabricated. Integrators must capture:
- mediated side-effect routes / total side-effect routes,
- unauthorized-effect count in fake-effector tests,
- approval request and timeout rates,
- p50/p95 approval latency,
- stale/mismatched token rejection rate,
- audit-event coverage.

## Verified package invariants
1. **Transport independence:** risk classification does not use `transport` to weaken a decision.
2. **Unknown fail closed:** unknown capability maps to DENY.
3. **Untrusted annotations cannot authorize:** reference decision logic does not use annotations as an allow primitive.
4. **Approval scoping:** token verification requires actor, parent task, capability, target and argument hash to match.
5. **Expiry:** expired token is rejected.
6. **High-risk approval:** destructive local, external write, credential/identity and production classes require approval in default policy.
7. **Registration gate:** inventory exits non-zero for a side-effecting adapter without mediation.

## Required integration verification
Before claiming production verification, execute the real adapter suite with fake effectors and prove:
- 100% of mutable/open-world adapters call UAB before the effector;
- terminal/MCP/subagent routes for equivalent operations produce identical decisions;
- no adapter can directly dispatch on boundary error;
- approval waits terminate within configured timeout;
- delegated flows either have an answerable responder or deny without hanging;
- no production secret is stored in audit or token test fixtures;
- security reviewer independent from implementer signs off.

## Definition of Done
- Evidence documented with current public signals and primary protocol guidance.
- Current approaches and limitations documented.
- Capability inventory complete.
- All side-effecting routes mediated.
- Unknown routes disabled or denied.
- Contract tests pass.
- Fake-effector bypass count = 0.
- Approval waits are bounded.
- Token mutation/expiry tests pass.
- Audit coverage = 100% of boundary decisions.
- Risks and rollback documented.
- Independent verification complete.
- No blocking issue remains.

## Failure policy
Detection: failing contract test, uncovered route, boundary exception, responder absence, token mismatch or audit gap.
Evidence: preserve redacted request metadata, operation digest, policy version and failing test output.
Retry policy: maximum two implementation repair cycles; approval-channel delivery may retry once.
Fallback: disable mutable adapter or restore prior stricter gate.
Escalation: security/release owner.
Stop condition: any known bypass, unknown enabled route, unbounded approval wait or fail-open behavior blocks release.
