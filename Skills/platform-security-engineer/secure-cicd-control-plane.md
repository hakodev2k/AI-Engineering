# Secure CI/CD Control Plane

## Purpose
Secure CI/CD systems as privileged platform infrastructure so pipeline execution, credentials, runners, approvals, and deployment identities cannot be abused to compromise workloads or environments.

## When to use
Use when designing build/deploy platforms, reviewing pipeline compromise risk, introducing shared runners, changing deployment authentication, or responding to CI/CD credential abuse.

## Inputs
Pipeline definitions, runner architecture, artifact flow, deployment identities, secret usage, branch protections, approval rules, plugin/actions inventory, and audit logs.

## Context to inspect
Inspect who can modify pipelines, reusable workflow inheritance, runner isolation, cache sharing, network egress, secret exposure, fork behavior, artifact provenance, deployment permissions, and production gates.

## Core knowledge
CI/CD is part of the production control plane. A pipeline editor may effectively become a production operator if workflow changes can access privileged credentials. Security requires separation between code contribution, pipeline governance, artifact production, and deployment authorization.

## Procedure
1. Map pipeline modification rights and deployment privileges.
2. Separate untrusted build execution from trusted deployment execution.
3. Use ephemeral isolated runners for untrusted or multi-tenant jobs.
4. Replace static deployment secrets with workload federation.
5. Pin and govern third-party actions, plugins, and reusable workflows.
6. Protect privileged pipeline definitions and production environment rules.
7. Prevent secrets from reaching fork or untrusted contexts.
8. Restrict runner network and metadata access.
9. Generate immutable artifacts once and promote them across environments.
10. Attach provenance and verify it before deployment.
11. Log workflow changes, approvals, credential exchanges, and deployments.
12. Test malicious pull request, pipeline modification, cache poisoning, and runner escape scenarios.

## Decision points
Use dedicated runners when isolation or network trust cannot be achieved safely on shared infrastructure. Require independent deployment authorization when code merge rights should not imply production control.

## Common failure patterns
Long-lived cloud keys, production secrets in build jobs, mutable tags for third-party actions, persistent shared runners, rebuilding artifacts per environment, and reviewers approving code without understanding pipeline changes.

## Verification
Verify untrusted jobs cannot access production credentials, deployment requires the intended trust path, runner state is destroyed between jobs, provenance is checked, and audit logs reconstruct the release chain.

## Expected output
A hardened CI/CD trust model, isolated execution design, scoped deployment identity, provenance controls, and tested abuse cases.

## Stop conditions
Stop and escalate when untrusted contributors can execute with production credentials, shared runner isolation is unprovable, or pipeline changes can silently bypass deployment controls.