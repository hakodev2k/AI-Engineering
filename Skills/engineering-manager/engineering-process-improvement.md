# Engineering Process Improvement

## Purpose
Improve engineering flow and quality by diagnosing system constraints and testing targeted changes rather than adding process by default.

## When to use
Use when lead time grows, handoffs multiply, defects recur, approvals stall work, releases are painful, or teams report persistent workflow friction.

## Inputs
Workflow, delivery data, queue times, defect and incident data, team feedback, approval rules, tooling, and dependency behavior.

## Context to inspect
Observe actual work from request to production, including waits, rework, batching, reviews, environments, approvals, and interruptions.

## Core knowledge
Most process problems are system problems. Local utilization optimization can worsen end-to-end flow. Improvements should target bottlenecks and be evaluated by outcomes, not ceremony compliance.

## Procedure
1. Define the outcome to improve.
2. Map the current workflow and wait states.
3. Measure baseline lead time, failure, or rework where possible.
4. Identify the dominant constraint or recurring failure mode.
5. Investigate why the constraint exists.
6. Design the smallest intervention likely to change it.
7. Pilot with clear success and rollback criteria.
8. Measure effect and unintended consequences.
9. Standardize useful changes with automation where appropriate.
10. Remove obsolete steps and repeat the diagnostic cycle.

## Decision points
Automate stable repetitive controls; simplify or remove controls whose risk reduction is not worth their delay. Avoid large process transformations when a bounded experiment can test the hypothesis.

## Common failure patterns
Adding meetings, optimizing developer busyness instead of flow, copying another company's process, measuring compliance, and changing multiple variables without learning which mattered.

## Verification
Verify baseline and post-change outcomes are comparable, the targeted constraint improved, and quality, safety, or team health did not materially regress.

## Expected output
An evidence-based process change with measured effect, documented rationale, and follow-up decision.

## Stop conditions
Stop when data cannot support the proposed intervention, the process is mandated by regulation without an approved alternative, or changes create unacceptable control gaps.