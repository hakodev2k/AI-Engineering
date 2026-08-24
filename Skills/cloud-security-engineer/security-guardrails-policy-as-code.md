# Security Guardrails and Policy as Code

## Purpose
Encode high-value cloud security invariants as automated preventive or detective policies.

## When to use
Use for organization policies, CI gates, admission controls, or recurring configuration defects.

## Inputs
Security standards, cloud APIs, IaC, deployment workflows, exception requirements, and historical findings.

## Context to inspect
Inspect where policy can be enforced, failure impact, resource lifecycle, existing exceptions, and developer feedback loops.

## Core knowledge
Good guardrails are deterministic, testable, explainable, and targeted at material risk. Preventive controls need low false-positive rates and safe escape hatches.

## Procedure
1. Select a security invariant with clear risk rationale.
2. Define machine-testable conditions.
3. Choose enforcement point: authoring, plan, deploy, or runtime.
4. Write policy and positive/negative tests.
5. Pilot in audit mode.
6. Measure false positives and operational impact.
7. Provide actionable failure messages.
8. Add time-bounded exception workflow.
9. Promote to enforcement when confidence is sufficient.
10. Monitor policy effectiveness and drift.

## Decision points
Prevent when violations are unambiguously dangerous; detect when context or migration risk makes blocking unsafe.

## Common failure patterns
Thousands of low-value rules, no tests, silent policy changes, permanent exemptions, and blocking without remediation guidance.

## Verification
Run policy tests, attempt known-invalid deployment, verify valid deployment succeeds, and audit exception expiry.

## Expected output
Tested guardrail with enforcement rationale, remediation guidance, telemetry, and exception handling.

## Stop conditions
Stop rollout if false positives can cause broad outages or enforcement semantics are not understood.