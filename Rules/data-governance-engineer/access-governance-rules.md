# Access Governance Rules
## Purpose
Ensure data access is justified, least-privileged, reviewable, and revocable.
## Scope
Human, service, analytical, and third-party access to governed data.
## MUST
- Access MUST have a legitimate purpose, appropriate authorization, and least-privilege scope.
- Sensitive access MUST be time-bounded or periodically recertified according to risk.
- Revocation MUST occur promptly when purpose, role, or authorization ends.
## MUST NOT
- Shared credentials or undocumented standing access MUST NOT bypass governance controls.
- Convenience MUST NOT justify broad access to sensitive datasets.
## SHOULD
- Access decisions SHOULD use attributes such as classification, purpose, geography, and role where supported.
## Exceptions
Emergency access requires logging, expiry, retrospective review, and accountable approval.
## Verification
Inspect entitlement inventories, approval evidence, recertification results, revocation timing, and access logs.