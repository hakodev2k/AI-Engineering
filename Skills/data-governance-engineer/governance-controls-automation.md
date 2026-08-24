# Governance Controls Automation

## Purpose
Convert repeatable governance requirements into automated preventive, detective, and evidentiary controls.

## When to use
Use when manual governance does not scale, controls are inconsistently applied, or audit evidence is expensive to produce.

## Inputs
Policies, standards, platform APIs, metadata, CI/CD workflows, identity controls, quality rules, evidence requirements.

## Context to inspect
Inspect existing delivery gates, policy engines, catalog hooks, cloud controls, exception workflows, false-positive history, and ownership.

## Core knowledge
Automate deterministic requirements; retain human judgment for ambiguity and material exceptions. Controls need versioning, testability, observability, ownership, and safe failure modes.

## Procedure
1. Inventory governance requirements and current controls.
2. Classify each as automatable, assistive, or judgment-based.
3. Prioritize high-volume/high-risk controls.
4. Define machine-readable policy and required metadata.
5. Choose preventive versus detective enforcement based on impact.
6. Implement control in the closest reliable workflow.
7. Add tests, telemetry, ownership, and evidence capture.
8. Define exception and break-glass paths.
9. Pilot and measure false positives/negatives.
10. Roll out progressively.
11. Version controls with policy changes and monitor drift.

## Decision points
Block when violation creates unacceptable risk and signal quality is high; warn/quarantine when uncertainty or availability impact is material.

## Common failure patterns
Automating ambiguous policy, silent control failure, no exception path, brittle regex-based enforcement, excessive blocking, and evidence that cannot be traced to policy versions.

## Verification
Test compliant, noncompliant, exception, outage, and rollback scenarios; confirm decisions and evidence are reproducible.

## Expected output
Automated controls with policy mappings, tests, telemetry, evidence, ownership, and exception handling.

## Stop conditions
Escalate automation that could cause destructive production impact, lacks reliable inputs, or encodes unresolved policy interpretation.