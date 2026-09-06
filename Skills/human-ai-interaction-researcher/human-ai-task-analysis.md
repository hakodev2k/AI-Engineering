# Human-AI Task Analysis

## Purpose
Model how work is divided, coordinated, and verified between a person and an AI system so research evaluates the real joint system rather than isolated model capability.

## When to use
Use for copilots, assistants, agents, decision support, creative tools, automation, or any workflow where humans and AI share responsibility.

## Inputs
User goals, workflow artifacts, current process, AI capabilities, constraints, error costs, permissions, and downstream dependencies.

## Context to inspect
Observe current work, existing tools, handoffs, exception paths, information sources, time pressure, expertise differences, and consequences of errors.

## Core knowledge
Human-AI performance is an interaction property. Automation can shift rather than remove work by creating prompting, monitoring, correction, verification, and recovery tasks. Allocation should consider comparative strengths, accountability, observability, reversibility, and failure severity.

## Procedure
1. Define the end-to-end user goal and success criteria.
2. Decompose the workflow into meaningful tasks and decisions.
3. Record information required, outputs produced, dependencies, and error consequences for each task.
4. Identify what the human currently perceives, decides, creates, verifies, and communicates.
5. Identify what the AI can propose, transform, retrieve, predict, decide, or execute.
6. Map candidate allocations: human-only, AI-assisted, AI-led with review, or automated.
7. Add new work introduced by AI, including prompt formulation, oversight, correction, and exception handling.
8. Identify handoff points and required context transfer.
9. Mark irreversible, high-stakes, ambiguous, or accountability-sensitive actions.
10. Define research questions around coordination bottlenecks and failure recovery.
11. Validate the map with representative users and domain experts.

## Decision points
Keep humans in control when judgment, accountability, contextual knowledge, or irreversible consequences dominate. Increase automation when tasks are well specified, observable, reversible, and reliably evaluated. Avoid binary human-versus-AI framing when collaboration is the actual design space.

## Common failure patterns
Automating the visible task while ignoring verification work, assuming expert and novice workflows are identical, hiding handoff costs, and measuring model accuracy without measuring joint task completion.

## Verification
Walk through realistic successful and failed scenarios using the task map. Confirm that every AI action has an owner for verification or recovery where required.

## Expected output
A human-AI task model showing task decomposition, allocations, handoffs, oversight needs, risks, and research priorities.

## Stop conditions
Stop when the underlying workflow cannot be observed or described, accountability is unresolved, or the proposed AI capability is too unstable to map meaningful responsibilities.