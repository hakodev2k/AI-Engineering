# Workflow Discovery and Decomposition

## Purpose
Map real work at the task, handoff, decision, and exception level so AI changes target the actual operating process rather than an idealized process diagram.

## When to use
Use before designing copilots, agents, automations, or AI-assisted workflows.

## Inputs
User interviews, process documents, system screenshots, event logs, policies, roles, volumes, exception cases, and service-level expectations.

## Context to inspect
Inspect upstream inputs, downstream consumers, manual workarounds, approvals, hidden spreadsheets, duplicate entry, escalation paths, and where workers apply judgment.

## Core knowledge
Observed work often differs from documented work. Senior adoption engineering distinguishes task frequency from task importance, routine paths from exceptions, and cognitive judgment from clerical movement of information.

## Procedure
1. Identify the workflow trigger and final outcome.
2. Observe or reconstruct the current path end to end.
3. Break the process into tasks, decisions, handoffs, and waiting states.
4. Capture systems, data, actors, and permissions for each step.
5. Record exceptions and recovery behavior.
6. Identify repetitive cognitive work, synthesis, lookup, classification, and drafting opportunities.
7. Mark decisions requiring accountability or domain authority.
8. Quantify baseline effort, delay, error, and rework where possible.
9. Separate automation candidates from augmentation candidates.
10. Validate the map with practitioners, not only managers.

## Decision points
Automate stable, observable, reversible steps first. Augment judgment-heavy tasks where users need context or suggestions but retain responsibility. Avoid removing controls merely because AI can imitate them.

## Common failure patterns
Mapping only the happy path, interviewing only process owners, overlooking informal tools, confusing waiting time with labor time, and ignoring exception handling.

## Verification
Practitioners should recognize the workflow as accurate, including exceptions, handoffs, data sources, and decision ownership.

## Expected output
A validated workflow map with baseline measures, automation/augmentation candidates, risk points, and dependencies.

## Stop conditions
Stop if real practitioners cannot be accessed, critical workflow steps remain disputed, or required systems/data cannot be inspected.