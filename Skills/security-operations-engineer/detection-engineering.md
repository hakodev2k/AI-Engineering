# Detection Engineering

## Purpose
Design production detections that convert adversary behavior into reliable, maintainable alerts with measurable coverage and acceptable analyst load.

## When to use
Use when creating or tuning SIEM/EDR/cloud detections, closing ATT&CK coverage gaps, or converting incident findings into controls. Do not use as a substitute for preventive controls.

## Inputs
Threat hypothesis, telemetry inventory, schemas, historical events, ATT&CK technique, baseline behavior, incident evidence, response ownership and severity policy.

## Context to inspect
Confirm data source health, field semantics, time normalization, identity/asset context, existing rules, suppression logic, downstream automation and analyst workflow.

## Core knowledge
Prefer behavior and invariant abuse over brittle indicators. A useful detection balances precision, recall, latency, explainability, cost and responseability. Coverage without usable telemetry is theoretical.

## Procedure
1. State the threat hypothesis and attacker behavior.
2. Identify minimum observable signals and required joins.
3. Validate telemetry completeness with known examples.
4. Build the simplest query that captures the behavior.
5. Backtest against representative historical windows.
6. Investigate false positives and define defensible exclusions.
7. Assign severity from impact, confidence and asset context.
8. Add enrichment and evidence needed for triage.
9. Define response actions and owner.
10. Test with simulation or replay where safe.
11. Version the rule and document assumptions.
12. Monitor firing rate, precision and data-source drift.

## Decision points
Choose threshold, sequence, correlation or anomaly logic based on behavior stability and data quality. Use suppression only for understood benign causes; never hide unexplained noise.

## Common failure patterns
Rules built from one incident sample; hard-coded environment values; missing data-health checks; excessive exclusions; no triage context; alerting on events that cannot be acted on.

## Verification
Demonstrate expected positive cases, representative negative cases, acceptable alert volume, correct enrichment and routing, and successful response-path execution.

## Expected output
A versioned detection with query, rationale, mapped behavior, tests, tuning notes, severity, runbook link and health metrics.

## Stop conditions
Escalate when required telemetry is absent, privacy/legal constraints block collection, or safe validation cannot be performed.