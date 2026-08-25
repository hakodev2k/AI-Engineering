# Policy and Admission Control

## Purpose
Enforce Kubernetes platform invariants automatically at admission time while preserving developer usability.
## When to use
Security baselines, governance, multi-tenancy, image policy, or configuration quality enforcement.
## Inputs
Policy requirements, exception process, workload inventory, admission technology, audit findings.
## Context to inspect
ValidatingAdmissionPolicy, webhooks/policy engines, Pod Security Admission, namespaces, exemptions, failurePolicy, controller availability.
## Core knowledge
Admission controls can prevent unsafe state but can also block the entire deployment path. Policies need audit mode, deterministic evaluation, versioning, and break-glass design.
## Procedure
1. Convert requirements into testable invariants. 2. Determine native versus external policy mechanism. 3. Start in audit/warn mode. 4. Measure violations. 5. Fix common workloads. 6. Define narrow exceptions with expiry/owner. 7. Enforce progressively. 8. Test controller failure and API-server behavior. 9. Monitor denies and latency.
## Decision points
Prefer native admission features for simple stable rules; use policy engines when richer reusable logic and reporting justify the dependency.
## Common failure patterns
Immediate enforce mode, fail-closed webhook without HA, permanent exemptions, vague denial messages, and policies based on mutable labels.
## Verification
Run positive/negative admission tests, failure-mode tests, latency checks, and exception audits.
## Expected output
Versioned policy controls with tests, rollout plan, exceptions, and operational ownership.
## Stop conditions
Stop if enforcement can block critical recovery workflows without tested break-glass access.