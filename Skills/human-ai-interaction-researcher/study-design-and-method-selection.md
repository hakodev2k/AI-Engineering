# Study Design and Method Selection

## Purpose
Choose a research design that matches the decision, evidence standard, AI-system variability, participant constraints, and risk of incorrect conclusions.

## When to use
Use when converting research questions into a concrete study plan or reviewing whether a proposed method can support its claims.

## Inputs
Research questions, hypotheses where applicable, target population, system configuration, decision deadline, risks, prior evidence, budget, and recruitment constraints.

## Context to inspect
Inspect the interaction flow, AI behavior, instrumentation, prior studies, available logs, task ecology, user expertise, deployment context, and likely confounders.

## Core knowledge
Method choice follows the claim, not habit. Interviews reveal perceptions and mental models; contextual inquiry reveals situated work; usability tests reveal interaction breakdowns; experiments can estimate causal effects; surveys estimate distributions only when sampling and measurement are defensible; log analysis reveals behavior but not necessarily intent. Mixed methods can triangulate evidence when their roles are explicit.

## Procedure
1. Restate each question and the claim it must support.
2. Determine whether behavioral, attitudinal, contextual, longitudinal, comparative, or causal evidence is required.
3. Identify variables introduced by the AI system and participant learning.
4. Select the smallest method set capable of supporting the required claim.
5. Define unit of analysis and sampling strategy.
6. Decide between within-subject, between-subject, observational, longitudinal, or mixed designs as applicable.
7. Control or record model version, prompts, context, retrieval state, latency, and other material system variables.
8. Define tasks that represent realistic work rather than artificial demonstrations.
9. Specify primary and secondary measures before data collection.
10. Plan qualitative capture for unexpected behaviors and failure modes.
11. Identify threats to validity and mitigation strategies.
12. Pilot the design and revise before full execution.

## Decision points
Prefer within-subject comparisons when individual variance is large and carryover can be controlled. Prefer between-subject designs when learning or contamination would invalidate comparison. Use field studies when context materially shapes behavior. Use lab studies when control is necessary. Combine methods only when each contributes independent evidence.

## Common failure patterns
Selecting interviews to answer performance questions, treating telemetry as intent, uncontrolled model changes, unrealistic tasks, too many outcome measures, post-hoc hypotheses, and claiming causality from observational evidence.

## Verification
Confirm every measure traces to a research question, system variables are recorded, validity threats are documented, and the planned analysis cannot silently exceed what the design supports.

## Expected output
A defensible study protocol with method rationale, sampling, conditions, measures, task design, controls, analysis plan, validity threats, and pilot criteria.

## Stop conditions
Stop when the required claim needs a design that cannot be executed ethically or operationally, critical system variables cannot be observed, or recruitment cannot represent the population relevant to the decision.