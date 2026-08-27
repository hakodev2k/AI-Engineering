# Availability and Resilience
## Purpose
Keep identity dependencies from causing uncontrolled business outages.
## Scope
Identity providers, directories, policy services, federation, and provisioning dependencies.
## MUST
- Critical identity paths MUST have documented availability objectives and failure behavior.
- Dependency timeouts, retries, caching, and failover MUST preserve security semantics.
- Recovery procedures MUST be tested for critical identity components.
## MUST NOT
- Fail-open authorization MUST NOT be introduced without explicit risk approval.
- Retry storms MUST NOT be allowed to amplify identity-provider outages.
## SHOULD
- Design degraded modes that preserve least privilege and bounded freshness.
## Exceptions
Require documented business impact, security risk, controls, and owner approval.
## Verification
Failure tests, disaster-recovery exercises, dependency metrics, load tests, and configuration review.