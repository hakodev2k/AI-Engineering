# Azure Service Selection Rules

## Purpose
Choose Azure services from explicit requirements and operational trade-offs.

## Scope
Managed services, PaaS, IaaS, serverless, containers, data, integration, networking, and platform capabilities.

## MUST
- Document material functional and non-functional constraints before committing to a strategic service choice.
- Compare security, reliability, scalability, portability, regional availability, operations, skills, and cost for significant decisions.
- Verify required features in the intended region and service tier.
- Account for service limits, lifecycle status, and migration difficulty.
- Record consequential decisions and rejected alternatives.

## MUST NOT
- Select a service solely because it is fashionable or already familiar.
- Depend on preview features for critical production requirements without explicit risk acceptance.
- Ignore operational ownership after deployment.

## SHOULD
- Prefer the simplest managed service that satisfies requirements and organizational constraints.
- Revisit decisions when workload assumptions materially change.

## Exceptions
Time-critical choices require documented assumptions, risks, and a review date.

## Verification
Inspect architecture decision records, requirements, regional capability, pricing, service limits, lifecycle documentation, and operational readiness.