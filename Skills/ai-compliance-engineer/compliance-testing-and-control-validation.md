# Compliance Testing and Control Validation

## Purpose
Test whether AI compliance controls are actually implemented and operating effectively rather than relying on design documents or owner attestations.

## When to use
Use before launch, during periodic reviews, after incidents, before audits, or after remediation.

## Inputs
Control matrix, system configuration, logs, policies, test environment, evidence requirements, prior findings.

## Preconditions
Controls have defined objectives, owners, and pass criteria.

## Context to inspect
Production-like configuration, IAM, audit logs, model gateway, policy enforcement, human-review workflow, vendor settings, monitoring alerts.

## Core knowledge
Control design effectiveness and operating effectiveness are different. A technically present control may fail due to configuration drift, bypass paths, incomplete scope, or weak evidence.

## Procedure
1. Select controls based on risk and obligation priority.
2. Define test steps and expected results.
3. Inspect implementation evidence.
4. Exercise normal and negative paths.
5. Test bypass and exception scenarios.
6. Verify control coverage across environments and tenants.
7. Review operating evidence over the required period.
8. Record failures and compensating controls.
9. Assign remediation and retest dates.
10. Preserve test evidence for audit.

## Decision points
Increase test depth for high-risk, manual, recently changed, or historically failing controls. Use sampling only when population and sampling rationale are defensible.

## Common failure patterns
Testing documentation instead of behavior, checking only happy paths, ignoring control bypasses, and closing findings without retest.

## Verification
Every tested control has reproducible evidence, explicit pass/fail criteria, and independent confirmation of remediation where required.

## Expected output
A control-testing record with procedures, evidence, results, findings, risk ratings, remediation owners, and retest status.

## Stop conditions
Escalate when a mandatory control fails in production, evidence cannot prove operation, or testing would require unsafe destructive actions.