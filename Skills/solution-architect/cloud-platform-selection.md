# Cloud Platform and Service Selection

## Purpose
Choose cloud services based on architecture needs, organizational capability, risk, portability, and total cost rather than feature novelty.

## When to use
Use for cloud adoption, re-platforming, service selection, and workload modernization.

## Inputs
NFRs, deployment model, data needs, compliance, regions, existing cloud footprint, skills, cost constraints.

## Preconditions
Workload characteristics and operational ownership are known.

## Context to inspect
Managed services, quotas, SLAs, pricing, networking, identity, observability, backup, region availability, vendor support, IaC ecosystem.

## Core knowledge
Managed services reduce undifferentiated operations but increase platform coupling. Portability has a cost; avoid paying for theoretical portability with no business driver.

## Procedure
1. Identify mandatory workload capabilities.
2. Prefer managed services where they meet control and compliance needs.
3. Compare availability, scaling, security, networking, and recovery features.
4. Evaluate quotas and regional support.
5. Assess lock-in by migration cost, not by label.
6. Evaluate team capability and operational burden.
7. Estimate total cost under normal and peak loads.
8. Validate observability and automation support.
9. Prototype uncertain constraints.
10. Record selection and exit/revisit criteria.

## Decision points
Choose serverless, PaaS, containers, or VMs based on control needs, workload shape, team skills, and economics.

## Common failure patterns
Choosing services from marketing diagrams, multi-cloud without a business case, ignoring quotas, self-hosting commodity capabilities unnecessarily.

## Verification
Selected services satisfy NFRs, security, recovery, and cost expectations under representative scenarios.

## Expected output
Cloud service decision matrix and accepted trade-offs.

## Stop conditions
Stop when compliance, region, or contractual constraints are unresolved.