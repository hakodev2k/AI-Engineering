# DNS Dependency Rules

## Purpose
Control hidden dependencies between DNS and the systems that rely on or manage it.

## Scope
Applications, load balancers, mail, certificates, service discovery, identity, cloud, registrar, and automation dependencies.

## MUST
- Critical DNS records MUST have identifiable consuming systems and operational owners where practical.
- DNS changes affecting service discovery, mail routing, certificates, or failover MUST validate consumer semantics before release.
- Circular dependencies in DNS management and recovery paths MUST be identified and broken or explicitly mitigated.

## MUST NOT
- MUST NOT assume syntactically valid DNS data is operationally safe for consumers.
- MUST NOT make DNS recovery depend exclusively on names or identity services that fail with the same DNS outage.

## SHOULD
- Dependency maps SHOULD prioritize high-blast-radius names and control-plane dependencies.

## Exceptions
Unavoidable cycles require tested break-glass procedures and explicit risk ownership.

## Verification
Review dependency maps, consumer tests, recovery procedures, and controlled dependency-failure exercises.