# Human Oversight Design

## Purpose
Design human review that meaningfully reduces risk rather than merely adding a nominal approval step.

## When to use
Use for high-impact, uncertain, irreversible, regulated, or exceptional AI decisions and actions.

## Inputs
Risk scenarios, operator workflows, model outputs, confidence/evidence signals, escalation paths.

## Context to inspect
Reviewer expertise, workload, latency, information shown, override capability, automation bias, and audit requirements.

## Core knowledge
Human-in-the-loop is effective only when reviewers have time, authority, context, and usable evidence. Excessive alerts create rubber-stamping and fatigue.

## Procedure
1. Identify decisions requiring human authority.
2. Define triggers based on consequence and uncertainty.
3. Present source evidence, model rationale artifacts where appropriate, and uncertainty without implying certainty.
4. Give reviewers clear approve, reject, edit, and escalate actions.
5. Prevent the system from bypassing required review.
6. Measure review load, disagreement, overrides, and missed hazards.
7. Tune routing and sampling using observed risk.
8. Train reviewers on failure modes and automation bias.

## Decision points
Use mandatory review for high-consequence actions; sampling can suit lower-risk monitoring when coupled with strong controls.

## Common failure patterns
Approval fatigue; reviewers lacking source context; default-accept interfaces; no escalation route; measuring throughput instead of safety.

## Verification
Run scenario tests showing reviewers can detect, block, and escalate representative failures within operational constraints.

## Expected output
An oversight workflow with triggers, reviewer evidence, authority, metrics, and escalation rules.

## Stop conditions
Stop if reviewers cannot realistically detect the targeted failure or lack authority to prevent harm.