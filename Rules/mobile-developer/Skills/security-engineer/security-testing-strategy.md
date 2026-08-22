# Security Testing Strategy

## Purpose
Design a layered security testing approach that combines static, dynamic, dependency, configuration, authorization, and abuse-case testing based on actual system risk.

## When to use
Use when defining release gates, improving AppSec coverage, responding to recurring defects, or introducing new high-risk components.

## Inputs
Threat model, architecture, repositories, APIs, deployment topology, compliance needs, incident history, scanner capabilities, test environments.

## Context to inspect
Unit/integration tests, SAST, DAST, dependency scans, IaC scans, secret scans, fuzzing, penetration tests, CI/CD gates, and historical false positives.

## Core knowledge
No single security tool is sufficient. Effective testing maps techniques to threat classes and system boundaries. Automation is valuable for repeatable controls; targeted manual testing is still needed for business logic and chained attack paths.

## Procedure
1. Prioritize critical assets and abuse scenarios.
2. Map each major threat class to one or more testing techniques.
3. Add fast deterministic checks to developer workflows and CI.
4. Add integration-level negative authorization and input tests.
5. Use dynamic or fuzz testing for exposed parsers and APIs where valuable.
6. Schedule deeper manual or penetration testing for high-risk changes.
7. Define triage rules and ownership for findings.
8. Set risk-based release thresholds instead of raw finding counts.
9. Track false positives and recurring defect classes.
10. Add regression tests for confirmed vulnerabilities.

## Decision points
Block releases on exploitable high-impact findings with strong evidence. Use advisory checks for noisy tools until signal quality is sufficient.

## Common failure patterns
Tool-only security programs, scanning without ownership, treating all findings equally, no negative authorization tests, unstable gates that developers bypass, and penetration tests with no regression coverage.

## Verification
Critical threat scenarios have corresponding tests, gates behave consistently, confirmed vulnerabilities produce regression coverage, and unresolved high risks have explicit approval.

## Expected output
A risk-based security test matrix, CI/CD integration plan, ownership model, and measurable release criteria.

## Stop conditions
Escalate when testing would exceed authorized scope, require production exploitation, or expose sensitive data without approved handling.