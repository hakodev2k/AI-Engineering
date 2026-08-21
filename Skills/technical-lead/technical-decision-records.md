# Technical Decision Records

## Purpose
Capture important technical decisions so future engineers understand context, alternatives, trade-offs, and revisit conditions.

## When to use
Use for architecture, platform, data, integration, security, or operational decisions with lasting consequences.

## Inputs
Decision question, constraints, alternatives, evidence, stakeholders, risks.

## Context to inspect
Inspect prior decisions, current architecture, business/NFR drivers, dependencies, and assumptions likely to change.

## Core knowledge
A useful record explains why a decision was made, not merely what was chosen. Records should be concise, immutable in history, and superseded rather than silently rewritten.

## Procedure
1. State the decision and status.
2. Summarize relevant context and forces.
3. List realistic alternatives including the baseline.
4. Compare important trade-offs.
5. Record the selected option and rationale.
6. Describe positive and negative consequences.
7. Record assumptions and unresolved risks.
8. Define triggers for reconsideration.
9. Link implementation evidence where useful.
10. Supersede the record explicitly when the decision changes.

## Decision points
Create a record when future engineers could reasonably ask why a consequential choice was made; avoid records for trivial local implementation details.

## Common failure patterns
Decision-only records, retrospective justification, missing alternatives, excessive prose, and editing history to hide changed reasoning.

## Verification
A reader unfamiliar with the discussion can reconstruct the main constraints and rationale.

## Expected output
A concise durable decision record with context, trade-offs, consequences, and revisit triggers.

## Stop conditions
Stop when the decision is not yet mature enough to choose; record an open proposal instead if appropriate.