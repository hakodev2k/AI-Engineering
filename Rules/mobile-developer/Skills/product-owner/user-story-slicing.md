# User Story Slicing

## Purpose
Decompose large product changes into thin, independently valuable increments that improve feedback speed and delivery safety.

## When to use
Use when stories are too large for a short delivery cycle, contain multiple workflows, or delay validation until all components are complete.

## Inputs
User journey, business rules, proposed solution, dependencies, acceptance needs, and technical constraints.

## Context to inspect
Inspect the end-to-end user outcome, current behavior, workflow variants, data dependencies, interfaces, and release constraints.

## Core knowledge
Good slicing preserves vertical user value. Useful dimensions include workflow step, business rule, data variation, happy path versus exceptions, channel, persona, or capability depth. Component-only slices often postpone integration risk.

## Procedure
1. State the complete user outcome.
2. Map the minimum end-to-end path.
3. Separate essential behavior from variants and enhancements.
4. Find slices that can be demonstrated independently.
5. Preserve integration across required layers where feasible.
6. Sequence slices by learning value and risk.
7. Define acceptance criteria per slice.
8. Check that each slice can be released or validated safely.
9. Confirm later slices do not invalidate earlier contracts.
10. Re-slice when implementation evidence reveals hidden coupling.

## Decision points
Prefer a thin vertical slice over separate frontend/backend tasks when user validation matters. Use technical enabling work explicitly when no safe vertical slice exists.

## Common failure patterns
Splitting by technical layer, stories that still require all siblings to work, slicing only by task size, hiding dependencies, and losing the original user outcome.

## Verification
Verify each slice has a distinct acceptance outcome, can be tested end-to-end, and produces learning or usable value before the full epic is complete.

## Expected output
A sequenced set of small, coherent delivery slices tied to the same product outcome.

## Stop conditions
Escalate when architecture prevents safe incremental delivery or when required regulatory/business behavior cannot be partially released.