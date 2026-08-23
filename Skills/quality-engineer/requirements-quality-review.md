# Requirements Quality Review

## Purpose
Detect ambiguity, omissions, contradictions, and untestable expectations before implementation.

## When to use
Use during refinement, design, acceptance-criteria review, and change analysis.

## Inputs
Requirements, stories, acceptance criteria, domain rules, designs, stakeholder decisions.

## Context to inspect
Review actors, triggers, states, permissions, data rules, boundaries, errors, NFRs, integrations, and backward compatibility.

## Core knowledge
A useful requirement is understandable, necessary, feasible, consistent, bounded, and verifiable. Examples do not replace general rules.

## Procedure
1. Identify business outcome and actor.
2. Separate behavior from implementation assumptions.
3. Find undefined terms and hidden states.
4. Enumerate normal, boundary, invalid, and failure cases.
5. Check authorization and data rules.
6. Surface NFRs and integration assumptions.
7. Convert expectations into observable acceptance conditions.
8. Resolve contradictions with decision owners.
9. Record assumptions and open risks.

## Decision points
Seek clarification when ambiguity changes behavior; use documented reasonable defaults only when reversible and low risk.

## Common failure patterns
Happy-path-only criteria, UI-specific requirements without business rules, missing error behavior, and ambiguous words such as fast or secure.

## Verification
Confirm each requirement has objective evidence and unresolved questions are explicitly tracked.

## Expected output
A clarified, testable requirement set with risks and assumptions.

## Stop conditions
Stop when critical business rules conflict or no authorized decision owner is available.