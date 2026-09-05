# Container Security Incident Response Rules

## Purpose
Define disciplined response to suspected container compromise while preserving evidence and minimizing blast radius.

## Scope
Applies to compromised images, runtime alerts, credential exposure, suspicious workloads, registry events, and node-level container incidents.

## MUST
- Responders MUST identify affected workload, image digest, deployment revision, node, namespace or equivalent boundary, and relevant identities before drawing conclusions.
- Containment actions MUST prioritize preventing lateral movement, credential abuse, and further artifact deployment.
- Evidence from runtime telemetry, orchestrator audit logs, registry logs, CI/CD history, and host events MUST be preserved before destructive cleanup when operationally safe.
- Suspected credential exposure MUST trigger the appropriate rotation or revocation process.
- Compromised or untrusted images MUST be quarantined from further promotion and deployment.
- Significant incidents MUST document timeline, impact, containment, causal evidence, remediation, and prevention actions.

## MUST NOT
- MUST NOT delete compromised containers, nodes, logs, or artifacts reflexively if doing so destroys critical evidence and containment is otherwise possible.
- MUST NOT redeploy the same unverified image after a compromise merely to restore availability.
- MUST NOT claim root cause solely from temporal correlation.

## SHOULD
- Rebuild from trusted source and clean infrastructure after compromise rather than repair mutable runtime state.
- Convert confirmed failure modes into detection, admission, or CI controls.

## Exceptions
Emergency containment may precede normal review under incident authority, but actions MUST be documented and verified afterward.

## Verification
Review incident records, evidence preservation, containment actions, credential rotation, rebuilt artifact identity, and regression controls.