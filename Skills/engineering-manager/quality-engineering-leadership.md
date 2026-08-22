# Quality Engineering Leadership

## Purpose
Establish engineering quality as a system of design, review, testing, automation, observability, and ownership rather than relying on a final QA gate.

## When to use
Use when defect rates rise, releases are risky, teams disagree on quality standards, or delivery pressure repeatedly trades away regression protection.

## Inputs
Defect data, test strategy, CI/CD behavior, code review practices, incident history, architecture, release process, and customer impact.

## Context to inspect
Inspect where defects escape, feedback latency, flaky tests, manual bottlenecks, ownership boundaries, rollback capability, and which quality controls actually detect meaningful failures.

## Core knowledge
Quality investment should follow risk. Fast feedback belongs early; realistic integration and end-to-end checks should cover critical boundaries without making the entire suite slow and brittle.

## Procedure
1. Define critical quality outcomes and failure costs.
2. Analyze escaped defects and incident patterns.
3. Map preventive and detective controls across development and delivery.
4. Strengthen design and review practices for high-risk changes.
5. Improve automated tests at the most useful layer.
6. Reduce flaky or low-signal checks.
7. Make release, rollback, and feature-control paths safe.
8. Ensure production telemetry detects important regressions.
9. Assign quality ownership to engineering teams, with specialists enabling where useful.
10. Measure whether changes reduce defects and recovery cost.

## Decision points
Use deeper testing for high-risk paths; avoid expensive end-to-end coverage where lower-level tests provide equivalent confidence. Block releases only for controls tied to meaningful risk.

## Common failure patterns
QA as sole owner of quality, test-count targets, brittle E2E pyramids, ignored flaky tests, code review as style policing, and quality work cut silently under deadline pressure.

## Verification
Verify critical failure modes have effective controls, CI feedback is actionable, release recovery works, and quality metrics improve without unacceptable delivery friction.

## Expected output
A risk-based quality strategy with ownership, controls, gaps, and measurable improvement actions.

## Stop conditions
Escalate when required safety, security, regulatory, or contractual quality controls cannot be met before release.