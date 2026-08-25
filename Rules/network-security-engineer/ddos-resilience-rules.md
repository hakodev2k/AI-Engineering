# DDoS Resilience
## Purpose
Reduce availability risk from volumetric and protocol-level attacks.
## Scope
Internet edges, load balancers, DNS, network services, and upstream protection.
## MUST
- Critical public services MUST have documented DDoS assumptions and response paths.
- Protection capacity MUST be compared against credible attack and traffic scenarios.
- Escalation to providers and internal responders MUST be operationally documented.
- Mitigations MUST preserve essential legitimate traffic where feasible.
## MUST NOT
- Protection effectiveness MUST NOT be claimed without tests, provider evidence, or observed telemetry.
- Emergency filtering MUST NOT remain indefinitely without review.
## SHOULD
- Runbooks SHOULD include safe degradation and traffic-shedding options.
## Exceptions
Document risk acceptance, capacity constraints, compensating controls, and owner.
## Verification
Review capacity evidence, provider configuration, synthetic tests, exercises, alerts, and incident telemetry.