# Runner Security Rules

## Purpose
Protect CI/CD execution hosts from cross-job compromise and persistence.

## Scope
Hosted and self-hosted runners, executors, agents, containers, and worker pools.

## MUST
- Runner trust level MUST match workload trust level and credential sensitivity.
- Privileged production jobs MUST execute on isolated runners unavailable to untrusted contributions.
- Ephemeral runners MUST be preferred for secret-bearing or high-risk workloads.
- Runner images MUST be patched, versioned, and sourced from controlled images.
- Workspace, credentials, and temporary files MUST be removed between jobs.

## MUST NOT
- MUST NOT co-locate untrusted build execution with persistent production credentials.
- MUST NOT grant host or container privileges without documented necessity and review.
- MUST NOT rely on workspace cleanup alone as a security boundary for hostile code.

## SHOULD
- Network egress SHOULD be restricted to required destinations for sensitive jobs.
- Runner telemetry SHOULD support investigation of anomalous execution.

## Exceptions
Persistent or privileged runners require threat analysis, compensating isolation, owner, review interval, and approval.

## Verification
Inspect runner labels/pools, image provenance, patch level, privilege settings, network controls, cleanup behavior, and execute isolation tests between representative jobs.