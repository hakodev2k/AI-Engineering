# Admission Policy Rules

## Purpose
Prevent insecure container workloads from entering controlled clusters by enforcing deterministic admission-time security requirements.

## Scope
Applies to Kubernetes admission controllers, policy engines, image verification, workload validation, and policy exceptions.

## MUST
- High-value security requirements MUST be enforced through admission policy when technically feasible.
- Admission policies MUST validate image trust, privilege settings, required security contexts, and prohibited host access appropriate to the environment.
- Policy changes MUST be version-controlled, reviewed, and tested against valid and invalid workload examples.
- Denials MUST provide actionable reasons without exposing sensitive configuration.
- Exception mechanisms MUST be explicit, auditable, scoped to the smallest workload set, and time-bounded when possible.

## MUST NOT
- MUST NOT convert blocking security policies into audit-only mode merely to reduce deployment friction without approval.
- MUST NOT create broad namespace or cluster-wide exemptions for a single workload incompatibility.
- MUST NOT rely on developer memory for controls that can be deterministically validated.

## SHOULD
- Roll out new policies in observe, warn, then enforce stages when that reduces accidental disruption.
- Maintain regression tests for policy behavior.

## Exceptions
Exceptions require owner, rationale, affected policy, compensating controls, risk acceptance, and review date.

## Verification
Inspect policy definitions, test suites, admission audit logs, exception records, and representative deployment attempts.