# Risk and Failure-Mode Review

## Purpose
Systematically identify, prioritize, and mitigate operational, quality, security, privacy, compliance, and human-factor failures before an AI workflow is scaled.

## When to use
Use during design reviews, pilot readiness, production approval, major model changes, and post-incident learning.

## Inputs
Workflow map, architecture, model behavior, data flows, policy obligations, incident history, pilot findings, and downstream consequences.

## Context to inspect
Inspect error handling, fallback paths, human review, permissions, sensitive data, external dependencies, model/provider limits, abuse paths, and recovery mechanisms.

## Core knowledge
AI failures include not only outages but plausible incorrect output, stale context, over-reliance, unauthorized disclosure, tool misuse, silent degradation, cost spikes, and workflow-level control failures. Risk depends on likelihood, detectability, consequence, and reversibility.

## Procedure
1. Walk the workflow from trigger to downstream consequence.
2. Enumerate technical, model, data, human, integration, and policy failure modes.
3. Identify who or what detects each failure.
4. Score consequence, likelihood, detectability, and reversibility.
5. Identify preventive, detective, and recovery controls.
6. Confirm high-risk actions have appropriate approval or containment.
7. Define fallback and degraded modes.
8. Assign owners and deadlines for unresolved mitigations.
9. Test top failure modes using representative scenarios.
10. Reassess after significant model, data, integration, or scope changes.

## Decision points
Mitigate high-consequence failures even when rare. Accept low-impact failures only when detection and recovery are adequate. Remove capabilities whose risk cannot be bounded by available controls.

## Common failure patterns
Reviewing only infrastructure outages, assuming human review always works, ignoring silent quality degradation, no fallback, and documenting risks without owners.

## Verification
Top-ranked failure modes must have tested controls, owners, and observable evidence. Residual risk acceptance must be explicit.

## Expected output
A prioritized failure-mode register with controls, test evidence, owners, residual risks, and escalation requirements.

## Stop conditions
Stop and escalate when a high-consequence failure lacks an effective control or authorized risk owner.