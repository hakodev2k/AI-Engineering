# Cloud Security Architecture Rules

## Purpose
Ensure cloud architectures use explicit identity, isolation, data, network, logging, and governance controls.

## Scope
Public cloud, private cloud, hybrid services, managed services, serverless, containers, and cloud control planes.

## MUST
- Cloud designs MUST define account/subscription/project boundaries, identity model, network exposure, data classification, and logging requirements.
- Privileged control-plane access MUST use least privilege and strong authentication.
- Internet exposure MUST be explicitly justified and protected.
- Managed-service defaults MUST be reviewed against security requirements rather than assumed secure.
- Cloud resources MUST be governed by reproducible configuration and drift detection where practical.

## MUST NOT
- MUST NOT place production and lower-trust environments in shared security boundaries without documented isolation.
- MUST NOT grant broad administrative roles to workloads when scoped permissions are available.
- MUST NOT disable provider security controls solely to simplify deployment.

## SHOULD
- Prefer private connectivity, short-lived workload identity, policy-as-code, and centralized security telemetry.

## Exceptions
Require documented constraint, compensating control, residual risk, owner, and approval.

## Verification
Review cloud architecture, IAM policies, exposure scans, configuration policy results, logging, drift reports, and infrastructure code.