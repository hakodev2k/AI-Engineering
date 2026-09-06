# Solution Discovery and Problem Framing

## Purpose
Frame an AI initiative around a real business problem, user outcome, and operational constraint before choosing models or architecture. Senior architects use this skill to prevent technology-first designs that cannot prove value.

## When to use
Use at the start of a new AI initiative, during major scope changes, or when stakeholders disagree about what problem the system should solve. Do not use to bypass domain discovery when regulated or safety-critical expertise is required.

## Inputs
Business goals, user journeys, current process, pain points, constraints, existing systems, data sources, risk tolerance, success metrics, and stakeholder expectations.

## Preconditions
A decision sponsor exists and affected users or process owners can be identified.

## Context to inspect
Review process maps, support data, existing architecture, operational metrics, policy constraints, known failure modes, current manual work, and previous solution attempts. Distinguish evidence from assumptions.

## Core knowledge
AI is useful when uncertainty, language, perception, prediction, or adaptive reasoning materially improve outcomes. It is often inferior to deterministic software for strict rules, exact calculations, low-variance transactions, and irreversible actions without oversight.

## Procedure
1. Define the current state and target outcome in observable terms.
2. Identify the primary users and decision owners.
3. Map the workflow and locate the highest-friction or highest-value steps.
4. Separate deterministic requirements from probabilistic tasks.
5. Identify required inputs, outputs, actions, and integrations.
6. Document constraints for security, privacy, latency, availability, cost, compliance, and human review.
7. Define measurable success and guardrail metrics.
8. Identify alternatives that do not require AI.
9. State assumptions and unknowns requiring validation.
10. Produce a problem statement and solution boundary before architecture selection.

## Decision points
Choose AI only when its expected value exceeds added uncertainty and operational complexity. Prefer assistive workflows over autonomous actions when consequences are high or confidence is difficult to measure.

## Common failure patterns
Starting with a favored model, treating vague productivity claims as requirements, ignoring the current process, automating broken workflows, and failing to define a non-AI baseline.

## Verification
Stakeholders should be able to explain the problem, target outcome, success metrics, constraints, and why AI is justified. Architecture work should not depend on unstated assumptions.

## Expected output
A concise problem framing document with scope, users, workflow, requirements, constraints, assumptions, baseline, success metrics, and non-goals.

## Stop conditions
Stop and escalate when no measurable outcome exists, the process owner is unknown, critical policy ownership is unresolved, or the proposed AI capability cannot materially improve the target workflow.