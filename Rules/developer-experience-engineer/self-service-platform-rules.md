# Self-Service Platform Rules
## Purpose
Enable safe developer autonomy through paved paths with clear ownership and guardrails.
## Scope
Developer portals, service catalogs, provisioning, workflows, golden paths, and platform APIs.
## MUST
- Self-service actions MUST define ownership, authorization, validation, observable result, and failure recovery.
- Provisioning MUST enforce policy and least privilege at the platform boundary.
- Paved paths MUST expose supported escape hatches or escalation when legitimate requirements do not fit.
- Platform contracts MUST be versioned or evolved compatibly.
## MUST NOT
- MUST NOT turn convenience workflows into unaudited privileged backdoors.
- MUST NOT hide material cost, security, or production impact from the requester.
- MUST NOT claim self-service when routine success depends on undocumented operator intervention.
## SHOULD
- Common safe operations SHOULD be idempotent and automated.
- Defaults SHOULD encode organizational reliability and security requirements without unnecessary complexity.
## Exceptions
Nonstandard paths require documented requirement, risk, ownership, verification, and approvals appropriate to impact.
## Verification
Test authorization, policy enforcement, provisioning idempotency, failure recovery, audit trails, contract compatibility, and support-intervention rates.