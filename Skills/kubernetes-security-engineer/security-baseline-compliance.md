# Security Baseline and Compliance

## Purpose
Translate Kubernetes security requirements into an evidence-backed, maintainable technical baseline without confusing compliance with actual risk reduction.

## When to use
Use for cluster onboarding, audits, regulated environments, platform standards, and periodic posture reviews.

## Inputs
Applicable benchmarks/standards, organizational policy, cluster type/version, provider responsibilities, exceptions, and evidence sources.

## Preconditions
Identify which controls are applicable and technically controllable in the environment.

## Context to inspect
Inspect API server, etcd, kubelet, RBAC, pod security, networking, secrets, audit, node configuration, images, admission, backups, and managed-service boundaries.

## Core knowledge
Benchmarks are baselines, not universal prescriptions. Controls must be interpreted against architecture, Kubernetes version, managed-service constraints, and compensating controls.

## Procedure
1. Select applicable baseline requirements.
2. Map each requirement to cluster responsibility and technical evidence.
3. Automate objective checks where stable.
4. Validate high-risk findings manually.
5. Prioritize gaps by security impact.
6. Remediate without breaking supported provider configuration.
7. Document justified exceptions with owner/expiry.
8. Re-run checks and preserve evidence.
9. Review baseline after upgrades or architecture changes.

## Decision points
Do not implement a benchmark recommendation mechanically when it conflicts with supported architecture; document equivalent controls and residual risk.

## Common failure patterns
Chasing a score; treating not-applicable as failed; stale evidence; permanent exceptions; remediating low-value checks before exploitable gaps.

## Verification
Re-run automated/manual checks and confirm evidence reflects live configuration, not intended IaC alone.

## Expected output
A versioned baseline, risk-ranked findings, evidence, and governed exceptions.

## Stop conditions
Escalate material noncompliance with mandatory requirements or controls that cannot be implemented without architecture change.