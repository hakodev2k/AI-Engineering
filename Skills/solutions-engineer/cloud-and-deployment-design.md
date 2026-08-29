# Cloud and Deployment Design

## Purpose
Select deployment topology and cloud services that satisfy security, reliability, scale, operability, and organizational constraints.

## When to use
Use when moving from logical solution design to deployable architecture.

## Inputs
Workloads, regions, network constraints, compliance, availability targets, operational skills, cost constraints.

## Context to inspect
Accounts/subscriptions, regions, networking, compute options, managed services, quotas, deployment automation, tenancy, and support model.

## Core knowledge
Managed services trade control for operational leverage. Deployment topology affects failure domains, latency, security, data residency, and cost.

## Procedure
1. Identify deployment and residency constraints.
2. Map workloads to compute and managed-service options.
3. Define network and trust boundaries.
4. Choose region and failure-domain strategy.
5. Design configuration, secrets, and deployment automation.
6. Address scaling, backup, recovery, and observability.
7. Estimate quotas and operational burden.
8. Validate topology against NFRs.

## Decision points
Prefer managed services when reduced operational burden outweighs portability/control concerns; self-manage when required capabilities or constraints justify it.

## Common failure patterns
Default architectures without requirement mapping, hidden egress, unmanaged configuration drift, region assumptions, and missing quota analysis.

## Verification
Deployment design traces to NFRs and can be reproduced through documented automation or procedures.

## Expected output
A deployable topology with rationale and operational implications.

## Stop conditions
Stop when cloud policy, networking, residency, or quota constraints prevent a compliant design.