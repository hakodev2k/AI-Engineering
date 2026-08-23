# Ingress and Service Exposure Rules
## Purpose
Expose workloads through controlled, observable, and secure network entry points.
## Scope
Services, Ingress, Gateway API, load balancers, TLS, DNS, and external exposure.
## MUST
- Classify each endpoint as internal or external and enforce the intended exposure.
- Terminate TLS using approved certificates and renewal mechanisms for protected traffic.
- Define health behavior, timeouts, request-size constraints, and source restrictions where relevant.
- Review public exposure and authentication boundaries before production release.
## MUST NOT
- Create public load balancers or node ports without explicit need and ownership.
- Depend on undocumented controller-specific defaults for critical behavior.
## SHOULD
- Standardize exposure through supported ingress/gateway patterns.
## Exceptions
Direct exposure requires documented rationale, security review, and monitoring.
## Verification
Inspect rendered resources, cloud load balancers, DNS, TLS state, firewall rules, and external reachability tests.