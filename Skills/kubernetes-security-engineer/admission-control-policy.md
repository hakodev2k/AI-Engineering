# Admission Control Policy

## Purpose
Prevent insecure or noncompliant Kubernetes objects from entering the cluster using admission controls and policy-as-code.

## When to use
Use for mandatory image, privilege, label, provenance, resource, tenancy, or configuration controls.

## Inputs
Security requirements, manifests, exception process, admission technology, cluster versions, and failure-tolerance requirements.

## Preconditions
Translate requirements into deterministic checks and define behavior when the policy engine is unavailable.

## Context to inspect
Review built-in admission, ValidatingAdmissionPolicy, validating/mutating webhooks, policy engines, ordering, timeouts, match conditions, exemptions, and auditability.

## Core knowledge
Admission sits on the deployment critical path. Policies must balance fail-closed security with availability, latency, version compatibility, and emergency operations.

## Procedure
1. Define prohibited state and rationale.
2. Choose native admission when sufficient; otherwise justify external engines.
3. Build allowed and denied test fixtures.
4. Start in audit/warn mode where practical.
5. Measure false positives and admission latency.
6. Narrow exemptions by subject, scope, and time.
7. Enforce progressively.
8. Monitor denials, webhook health, and bypass paths.

## Decision points
Use validation instead of mutation for security invariants when explicit developer intent matters. Fail closed for critical controls only when availability design supports it.

## Common failure patterns
Opaque mutation; broad exemptions; unbounded webhook latency; policies that break system namespaces; no version tests.

## Verification
Run positive/negative admission tests, failure-mode tests, and bypass reviews. Confirm audit records identify policy and reason.

## Expected output
Versioned admission policies with tests, rollout plan, exceptions, and operational safeguards.

## Stop conditions
Escalate if enforcement can lock out cluster recovery or policy semantics cannot be tested reliably.