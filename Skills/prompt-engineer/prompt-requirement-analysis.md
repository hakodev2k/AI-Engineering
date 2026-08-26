# Prompt Requirement Analysis

## Purpose
Translate an ambiguous AI feature request into a testable prompt contract before prompt authoring begins. This prevents optimizing wording against unstated goals.

## When to use
Use for new prompts, major prompt revisions, agent instructions, extraction tasks, and prompt-related incident fixes. Do not use when requirements and acceptance tests are already explicit and current.

## Inputs
Business objective, target users, model/tool constraints, representative inputs, expected outputs, prohibited behavior, latency/cost limits, and evaluation evidence.

## Preconditions
Identify the decision owner and distinguish hard constraints from preferences.

## Context to inspect
Inspect existing prompts, schemas, model configuration, downstream consumers, safety controls, historical failures, eval datasets, and production telemetry. Never infer architecture from naming alone.

## Core knowledge
Prompt quality is multi-objective: correctness, robustness, safety, format adherence, latency, token cost, and maintainability can conflict. Requirements should describe observable behavior rather than preferred wording.

## Procedure
1. State the user and system outcome in one sentence.
2. Enumerate input classes, including malformed and adversarial inputs.
3. Define required output semantics and machine-readable constraints.
4. Separate invariants from examples and stylistic preferences.
5. Identify model, context-window, tool, latency, and cost constraints.
6. Record prohibited outputs and escalation behavior.
7. Convert requirements into measurable acceptance criteria.
8. Collect representative positive, negative, boundary, and ambiguity cases.
9. Identify dependencies whose behavior the prompt cannot control.
10. Resolve contradictions by priority rather than silently choosing one.
11. Produce a prompt contract suitable for evaluation.

## Decision points
Prefer deterministic schema constraints when downstream software parses output. Prefer semantic criteria when multiple valid answers exist. Escalate requirements that simultaneously demand incompatible properties such as exhaustive output and a strict tiny token budget.

## Common failure patterns
Optimizing for one happy-path example; treating tone as correctness; omitting refusal/escalation behavior; assuming model knowledge is current; hiding product logic in prose; accepting unverifiable criteria such as “high quality.”

## Verification
Implementation means a contract exists. Verification means every requirement maps to at least one test or review criterion, representative cases cover major input classes, and stakeholders can distinguish pass from fail without inspecting prompt wording.

## Expected output
A concise prompt contract containing objective, inputs, outputs, constraints, risks, acceptance criteria, and evaluation cases.

## Stop conditions
Stop and escalate when critical requirements conflict, sensitive-data policy is unknown, required model/tool capabilities are unavailable, or success cannot be measured with available evidence.