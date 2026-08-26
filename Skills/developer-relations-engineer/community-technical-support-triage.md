# Community Technical Support Triage

## Purpose
Triage developer questions efficiently while turning recurring support signals into durable product and content improvements.

## When to use
Use in forums, Discord/Slack, GitHub discussions, community calls, and public Q&A channels.

## Inputs
Question, reproduction details, environment/version, public docs, known issues, support boundaries.

## Context to inspect
Recent releases, status incidents, known regressions, canonical documentation, issue tracker, security/privacy constraints, and escalation routes.

## Core knowledge
DevRel support should diagnose enough to route accurately without becoming an undocumented private support system. Public answers should be reproducible, scoped, and safe.

## Procedure
1. Classify intent: how-to, defect, outage, conceptual, feature request, security, billing/account, or unsupported use.
2. Gather only information necessary to reproduce.
3. Check status/known issues and supported versions.
4. Reproduce safely when feasible.
5. Provide the smallest verified resolution or canonical reference.
6. Escalate product defects with evidence.
7. Move sensitive/account-specific matters to approved private support.
8. Tag recurring themes.
9. Convert repeated questions into docs, samples, diagnostics, or product fixes.
10. Close the loop publicly when appropriate.

## Decision points
Answer publicly when reusable and non-sensitive; escalate privately for credentials, account data, vulnerabilities, or contractual support. Prefer product fixes over accumulating workarounds.

## Common failure patterns
Guessing, requesting secrets, debugging production in public, overpromising timelines, one-off workarounds, and failing to capture recurring patterns.

## Verification
Confirm the resolution reproduces, links are current, sensitive data is absent, and escalated issues contain environment, steps, expected/actual behavior, and impact.

## Expected output
A verified response or correctly routed escalation plus reusable signal for systemic improvement.

## Stop conditions
Stop public troubleshooting when security, privacy, account access, production impact, or unsupported privileged access is involved.