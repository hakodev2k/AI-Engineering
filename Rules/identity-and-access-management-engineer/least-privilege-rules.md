# Least Privilege Rules

## Purpose
Minimize standing and effective access to the minimum required for legitimate work.

## Scope
Human, service, application, workload, and administrative permissions.

## MUST
- Access MUST be limited by action, resource, environment, and duration where controls support it.
- Privileged access MUST be separated from routine user access.
- Elevated privileges MUST be justified by an identifiable responsibility.
- Effective permissions MUST be evaluated, not only requested-role names.
- Excess privilege found during review MUST be removed or formally accepted with expiry.

## MUST NOT
- MUST NOT grant administrator-equivalent access as a convenience default.
- MUST NOT retain temporary privilege after the approved need ends.
- MUST NOT assume nested groups or inherited policies are harmless without evaluating resulting access.

## SHOULD
- Just-in-time and just-enough administration SHOULD replace standing privilege where practical.
- Permission bundles SHOULD be decomposed when they routinely overgrant.

## Exceptions
Any excess privilege requires owner, rationale, bounded scope, expiry, monitoring, and approval proportional to risk.

## Verification
Review effective-access reports, privilege assignments, inheritance paths, temporary grants, access-review findings, and removal evidence.