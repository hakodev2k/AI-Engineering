# Compute Platform Rules

## Purpose
Select and operate Azure compute according to workload constraints rather than convenience.

## Scope
Virtual Machines, VM Scale Sets, App Service, Container Apps, AKS, Functions, and related compute platforms.

## MUST
- Select compute based on runtime needs, scaling behavior, availability, isolation, operations, and cost.
- Define capacity, scaling, health, patching, and lifecycle ownership for production compute.
- Validate platform quotas and regional availability before critical rollout.
- Use supported runtime and OS versions with an upgrade path.
- Define resource limits and protection against runaway consumption where applicable.

## MUST NOT
- Choose Kubernetes solely because containerization is required.
- Run unsupported OS or runtime versions without an approved risk plan.
- Assume autoscaling compensates for inefficient or stateful workload design.

## SHOULD
- Prefer managed compute when it meets requirements and materially reduces operational burden.

## Exceptions
Self-managed complexity requires documented constraints, operational capability, and ownership.

## Verification
Inspect platform choice records, scaling configuration, health checks, runtime versions, quotas, utilization, and patch status.