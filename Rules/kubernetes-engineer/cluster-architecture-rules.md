# Cluster Architecture Rules
## Purpose
Keep Kubernetes platform topology deliberate, supportable, and aligned with workload risk.
## Scope
Cluster boundaries, control-plane assumptions, node pools, tenancy, regions, and lifecycle.
## MUST
- Define cluster failure domains, tenancy model, supported workload classes, capacity envelope, and ownership before onboarding production workloads.
- Separate workloads requiring materially different trust, availability, hardware, or lifecycle characteristics when isolation controls cannot provide equivalent protection.
- Document dependencies whose failure can prevent scheduling, networking, DNS, storage, admission, or recovery.
## MUST NOT
- Treat a cluster as an unlimited shared compute pool.
- Introduce a new cluster solely to bypass governance or unresolved platform constraints.
## SHOULD
- Prefer the simplest topology that satisfies isolation, resilience, compliance, and operational requirements.
## Exceptions
Exceptions require documented constraints, risk, rollback path, and accountable approval.
## Verification
Review architecture records, cluster configuration, failure-domain mapping, ownership, and recovery tests.