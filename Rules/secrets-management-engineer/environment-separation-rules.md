# Environment Separation Rules

## Purpose
Prevent lower-trust environments from becoming a path to production credentials and data.

## Scope
Development, test, staging, production, disaster recovery, and sandbox secret-management boundaries.

## MUST
- Production secrets MUST be isolated from non-production access domains using separate authorization boundaries.
- Non-production workloads MUST use non-production credentials unless an explicitly approved test requires otherwise.
- Promotion pipelines MUST reference environment-specific secret identifiers rather than copy secret values between environments.
- Administrative access to production secret systems MUST be independently controlled and audited.

## MUST NOT
- Production secret values MUST NOT be cloned into development or test for convenience.
- Shared credentials MUST NOT bridge environments when compromise would cross a required trust boundary.
- Lower-environment administrators MUST NOT automatically inherit production secret access.

## SHOULD
- Use separate accounts, projects, vaults, namespaces, or equivalent hard boundaries according to platform capabilities.
- Test rotation and recovery using representative non-production credentials.

## Exceptions
Cross-environment use requires explicit security approval, narrow duration/scope, monitoring, and documented cleanup.

## Verification
Inspect provider hierarchy, IAM policies, deployment references, secret identifiers, access logs, and scans for production credential reuse in lower environments.