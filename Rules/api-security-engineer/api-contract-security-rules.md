# API Contract Security Rules

## Purpose
Keep security properties explicit and reviewable in API contracts.

## Scope
OpenAPI or equivalent contracts, schemas, operations, parameters, responses, and security declarations.

## MUST
- Declare authentication requirements and security-relevant constraints for protected operations.
- Review contract changes for new data exposure, privilege, input surface, and compatibility risk.
- Keep implementation and published contract aligned for security-significant behavior.
- Treat newly exposed operations or fields as security-review triggers.

## MUST NOT
- Publish undocumented privileged behavior or rely on undocumented client assumptions for protection.
- Weaken security requirements as an accidental side effect of contract refactoring.

## SHOULD
- Validate contracts automatically and diff them in CI for security-sensitive changes.

## Exceptions
Intentional contract deviations require documented rationale, risk, owner, and remediation or compatibility plan.

## Verification
Use contract linting, schema diffing, integration tests, implementation comparison, and security review of changed surfaces.