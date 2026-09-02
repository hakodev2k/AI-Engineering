# Cloud Service Selection Rules

## Purpose
Select cloud services according to workload requirements, operational capability, lifecycle risk, and total system impact rather than convenience alone.

## Scope
Applies to managed services, infrastructure services, databases, integration services, compute platforms, and third-party cloud dependencies.

## MUST
- Service selection MUST trace to functional requirements and non-functional requirements including availability, security, compliance, latency, scale, recovery, supportability, and cost.
- Material service choices MUST assess maturity, regional availability, quotas, limits, failure modes, support model, portability, and deprecation risk.
- Teams MUST understand the operational responsibilities retained under the service's shared-responsibility model.
- Preview, beta, or equivalent non-general-availability services used for critical workloads MUST receive explicit risk approval.

## MUST NOT
- MUST NOT choose a service solely because it is the newest, most feature-rich, or easiest to provision.
- MUST NOT assume managed services remove the need for capacity, security, backup, observability, or incident planning.
- MUST NOT introduce a specialized service without a credible ownership and skills model.

## SHOULD
- Prefer managed capabilities when they materially reduce undifferentiated operational work without violating requirements.
- Prefer services with clear portability or migration options when strategic uncertainty is high.

## Exceptions
Exceptions require documented constraints, alternatives, service risks, operating model, exit strategy, and approval.

## Verification
Review decision records, service quotas and limits, support and lifecycle documentation, architecture tests, cost estimates, and operational readiness evidence.