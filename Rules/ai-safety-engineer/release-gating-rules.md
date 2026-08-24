# Release Gating Rules

## Purpose
Prevent safety-significant releases from bypassing required evidence and approvals.

## Scope
Covers model launches, capability expansions, policy changes, agent permissions, and material safety-control changes.

## MUST
- Define release criteria before final evaluation, including required tests, thresholds, unresolved-risk limits, and approvers.
- Block release when a mandatory safety criterion fails or required evidence is missing.
- Record the exact model, configuration, policy, tools, and permissions covered by approval.
- Require rollback or disablement capability for material safety changes.

## MUST NOT
- Convert failed mandatory criteria into optional criteria solely to meet a deadline.
- Approve a materially different artifact from the one evaluated.
- Allow the same automated system to silently waive its own safety gate.

## SHOULD
- Use staged rollout and exposure limits for uncertain but acceptable residual risks.
- Automate deterministic checks while retaining human judgment for high-impact trade-offs.

## Exceptions
Emergency waivers require named accountable approval, documented residual risk, compensating controls, expiry, and follow-up verification.

## Verification
Inspect release records, artifact hashes/versions, gate results, approvals, rollout limits, and rollback readiness.
