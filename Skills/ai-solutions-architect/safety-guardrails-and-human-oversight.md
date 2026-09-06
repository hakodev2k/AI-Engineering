# Safety Guardrails and Human Oversight

## Purpose
Design layered controls that keep AI behavior within acceptable boundaries and define where human judgment must remain in the loop.

## When to use
Use for user-facing generation, recommendations, decision support, agentic actions, regulated workflows, or any task with meaningful harm from incorrect output.

## Inputs
Use cases, risk classification, prohibited outcomes, escalation policies, action reversibility, user population, and acceptance criteria.

## Context to inspect
Inspect model behavior, moderation capabilities, business rules, tool side effects, review workflows, incident history, policy requirements, and user interface controls.

## Core knowledge
No single guardrail is sufficient. Effective safety combines scoped capability, deterministic rules, model-level controls, validation, human confirmation, monitoring, and recovery. Human review must be designed for real workload and cognitive limits.

## Procedure
1. Classify harms by severity and likelihood.
2. Define prohibited and review-required outcomes.
3. Reduce system authority before adding complex detection.
4. Add deterministic checks for enforceable rules.
5. Add input and output screening where useful.
6. Require confirmation for consequential or irreversible actions.
7. Define escalation and fallback behavior.
8. Design reviewer context and decision support.
9. Measure false positives, false negatives, and review burden.
10. Test edge cases and update controls from incidents.

## Decision points
Use hard blocking for clear policy boundaries; human review for nuanced high-impact cases; warnings or soft interventions for low-severity ambiguity. Prefer reversible designs when confidence is uncertain.

## Common failure patterns
Relying only on prompt wording, routing every case to humans, hiding uncertainty, and creating review queues too large to operate effectively.

## Verification
Safety evaluations and workflow tests demonstrate that critical harms are blocked or escalated and that reviewers can make informed decisions.

## Expected output
A safety architecture with risk classes, control layers, oversight points, escalation paths, and measurable guardrail performance.

## Stop conditions
Stop when high-impact decisions have no accountable oversight, critical harm cannot be bounded, or review capacity is insufficient for expected volume.