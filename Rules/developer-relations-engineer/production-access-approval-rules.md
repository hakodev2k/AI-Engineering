# Production Access and Approval Rules

## Purpose
Prevent Developer Relations work from exceeding its authority when interacting with production systems, sensitive data, or public contracts.

## Scope
Applies to production access, configuration changes, live customer environments, credentials, feature controls, and operational tooling.

## MUST
- Production access MUST follow least privilege and an approved business need.
- Actions that can change production behavior, customer data, security controls, public contracts, or service availability MUST require explicit human approval from the accountable owner.
- Analysis, recommendation, preparation, and execution MUST be treated as distinct authority levels.
- Any approved production action MUST have a documented scope, expected effect, validation step, and rollback or recovery plan where applicable.

## MUST NOT
- MUST NOT use privileged production access merely to simplify a demo, investigation, or content task.
- MUST NOT rotate secrets, change access controls, alter production configuration, or perform irreversible actions without explicit authorization.
- MUST NOT copy sensitive production data into public examples or personal workspaces.

## SHOULD
- Read-only evidence SHOULD be preferred over production mutation when diagnosing developer issues.
- Temporary access SHOULD expire automatically when practical.

## Exceptions
Emergency access may follow an approved incident process, but must preserve auditability and accountable human ownership.

## Verification
Inspect access grants, approval records, audit logs, change scope, validation evidence, rollback plans, and whether privileges were removed when no longer needed.