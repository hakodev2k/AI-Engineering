# Kubernetes Security Testing

## Purpose
Prove Kubernetes security controls through repeatable positive and negative tests rather than configuration inspection alone.

## When to use
Use before releases, after platform changes, during audits, and when validating remediation.

## Inputs
Threat model, policies, cluster configuration, test environment, expected allowed/denied behaviors, and authorization to test.

## Preconditions
Use a safe scope and explicit rules of engagement. Avoid destructive production tests unless approved.

## Context to inspect
Inspect RBAC, admission, pod security, network policy, workload identity, secrets, ingress/egress, audit, node boundaries, and supply-chain controls.

## Core knowledge
Implemented configuration is not equivalent to effective control. Tests should target bypasses and interaction between controls, not only happy paths.

## Procedure
1. Convert security requirements into testable assertions.
2. Define positive and negative cases.
3. Build disposable identities/workloads.
4. Test unauthorized API actions.
5. Test rejected insecure workloads.
6. Test cross-namespace/network isolation.
7. Test credential and external-service boundaries.
8. Test untrusted image/provenance rejection.
9. Verify audit/detection evidence.
10. Automate stable tests in CI or conformance runs.

## Decision points
Automate deterministic controls; keep complex adversarial scenarios as periodic exercises when automation would oversimplify them.

## Common failure patterns
Testing only configuration presence; destructive tests without isolation; no expected-denial assertions; tests that depend on cluster-admin.

## Verification
A control is verified only when the intended action succeeds and representative prohibited actions demonstrably fail with expected telemetry.

## Expected output
A reusable security test suite and evidence mapped to control requirements.

## Stop conditions
Stop tests that threaten availability, cross approved tenant boundaries, or reveal active compromise requiring incident handling.