# Release and Store Rules
## Purpose
Ship mobile releases safely through app-store constraints and delayed client adoption.
## Scope
Signing, store submissions, phased rollout, release notes, metadata, policy compliance, and rollout control.
## MUST
- Production signing material MUST be protected with least privilege and recovery procedures.
- Release candidates MUST be built from reproducible reviewed source and pass required quality gates.
- Rollout strategy MUST account for inability to instantly recall installed binaries.
- Store privacy/security declarations MUST match actual application and SDK behavior.
## MUST NOT
- Production signing secrets MUST NOT be committed to source control.
- A release MUST NOT depend on an immediate mandatory backend breaking change unless compatibility is enforced safely.
## SHOULD
- Use phased/staged rollout and release-health monitoring for material changes.
## Exceptions
Emergency full rollout requires explicit human approval, evidence, and rollback/mitigation plan.
## Verification
Audit signing access, build provenance, store metadata, release checklist, staged rollout metrics, and backend compatibility.