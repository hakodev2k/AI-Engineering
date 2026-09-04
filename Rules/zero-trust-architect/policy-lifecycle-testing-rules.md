# Policy Lifecycle and Testing Rules

## Purpose
Ensure access policy changes are reviewable, testable, reversible, and resistant to drift or accidental privilege expansion.

## Scope
Applies to authorization policies, conditional-access rules, network access policies, device requirements, workload policies, data-access policies, and related enforcement configuration.

## MUST
- Production policy definitions MUST be version-controlled or otherwise maintain an equivalent immutable change history with accountable authorship.
- Material policy changes MUST receive peer review before production deployment, with additional security approval when they expand high-risk access or weaken mandatory controls.
- Policies MUST have automated or deterministic tests where practical covering intended allow cases, intended deny cases, boundary conditions, and representative failure states.
- Policy changes MUST be evaluated for privilege expansion, affected identities and resources, operational impact, rollback, and interaction with dependent controls.
- Production rollout MUST use a controlled deployment mechanism that can detect unexpected denial or authorization changes before full exposure where the platform supports staged rollout.
- Drift between approved policy and effective enforcement state MUST be detectable for critical controls.
- Policy removal and exception expiry MUST be verified rather than assumed from configuration intent.

## MUST NOT
- High-impact production policy MUST NOT be edited directly through unmanaged interfaces when an approved deployment path exists.
- Test coverage MUST NOT validate only successful access while omitting expected denials.
- Emergency policy changes MUST NOT bypass retrospective review, documentation, and cleanup.
- A policy change MUST NOT be declared safe solely because configuration syntax is valid.

## SHOULD
- Policy-as-code SHOULD be used when the platform supports reliable automated validation and deployment.
- Shadow evaluation, simulation, canary deployment, or scoped pilot SHOULD precede broad rollout for high-risk changes.
- Test suites SHOULD include former incidents, known edge cases, and critical business workflows.

## Exceptions
Exceptions require documented urgency or technical limitation, exact scope, risk, compensating verification, accountable owner, expiry when applicable, and approval proportional to impact.

## Verification
Inspect policy repositories, change history, peer reviews, test results, deployment records, drift reports, simulations, denial telemetry, exception expirations, and rollback exercises. Confirm effective policy matches the approved version.