# Business Process Modeling

## Purpose
Model current and target business processes so teams can understand work, decisions, handoffs, bottlenecks, controls, and system touchpoints.

## When to use
Use during process redesign, automation, system replacement, integration work, or when operational behavior is poorly understood.

## Inputs
Process owners, SOPs, observed workflows, system interactions, roles, exceptions, metrics, and policy constraints.

## Preconditions
The process scope and start/end boundaries are known.

## Context to inspect
Actors, triggers, inputs, outputs, decisions, queues, handoffs, delays, exception paths, controls, and supporting systems.

## Core knowledge
Use a notation appropriate to the audience, such as BPMN, flowcharts, or swimlanes. The model must represent real behavior, not an idealized policy-only version.

## Procedure
1. Define process scope and business outcome.
2. Identify actors and systems involved.
3. Capture the as-is happy path.
4. Add decisions, exceptions, retries, manual work, and escalation paths.
5. Record data created or consumed at each important step.
6. Identify bottlenecks, duplicate work, control gaps, and unnecessary handoffs.
7. Validate the as-is model with people who execute the process.
8. Design the to-be process against measurable objectives.
9. Mark changes in roles, controls, systems, and data ownership.
10. Validate transition impacts and dependencies.

## Decision points
Use BPMN when execution semantics and complex branching matter; use simpler swimlanes when stakeholder readability matters more than formal precision.

## Common failure patterns
Modeling only the happy path, ignoring manual work, confusing organizational hierarchy with process flow, and designing the future state before validating the current one.

## Verification
Walk representative scenarios through the model with operators and confirm that every major exception has a path and owner.

## Expected output
Validated as-is and/or to-be process models with assumptions, pain points, controls, and system interactions.

## Stop conditions
Stop when critical process owners disagree on factual current behavior or required policy decisions are unresolved.