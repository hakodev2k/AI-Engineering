# Service and Machine Identity
## Purpose
Manage non-human identities as first-class security principals.
## Scope
Services, workloads, devices, automation, and machine credentials.
## MUST
- Every machine identity MUST have an owner, purpose, allowed resources, and lifecycle.
- Workload credentials MUST be scoped and rotated or made ephemeral according to risk.
- Decommissioning a workload MUST remove its effective credentials and grants.
## MUST NOT
- Human credentials MUST NOT be repurposed for unattended workloads.
- Static secrets MUST NOT be used when a practical managed or workload-identity mechanism exists without documented justification.
## SHOULD
- Prefer short-lived, automatically issued credentials bound to workload identity.
## Exceptions
Document platform limitation, exposure, rotation, monitoring, and migration plan.
## Verification
Inventory identities, scan secrets, inspect grants, test rotation, and reconcile runtime workloads to principals.