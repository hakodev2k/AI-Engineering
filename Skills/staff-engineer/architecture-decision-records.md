# Architecture Decision Records

## Purpose
Create durable decision records that preserve context, alternatives, trade-offs, and consequences for consequential technical choices.

## When to use
Use when a decision affects multiple teams, creates long-lived constraints, changes platform direction, or would be expensive to rediscover later.

## Inputs
Decision problem, constraints, alternatives, evidence, stakeholders, chosen option, known consequences.

## Preconditions
The decision is concrete enough to state and has an accountable owner.

## Context to inspect
Existing ADRs, architecture principles, system constraints, incident history, cost and performance evidence, and dependencies.

## Core knowledge
An ADR is not a design document. It records why a choice was made at a point in time, what was rejected, and what evidence should cause reconsideration.

## Procedure
1. State the decision and date.
2. Describe the context and forces shaping it.
3. List viable alternatives.
4. Compare key trade-offs and evidence.
5. Record the selected option and rationale.
6. Document consequences, risks, and follow-up work.
7. Define revisit triggers when assumptions may change.
8. Link related ADRs and implementation artifacts.
9. Obtain review from materially affected owners.

## Decision points
Create an ADR only for decisions worth preserving. Supersede rather than silently rewriting historical decisions when the architecture changes.

## Common failure patterns
Recording only the chosen solution, retroactively manufacturing rationale, omitting rejected options, hiding uncertainty, and treating ADR approval as bureaucracy.

## Verification
Confirm a future engineer can understand the original problem, alternatives, rationale, consequences, and conditions for revisiting the choice.

## Expected output
A concise, versioned ADR with context, decision, alternatives, consequences, and revisit triggers.

## Stop conditions
Stop when no actual decision has been made or stakeholders disagree on the underlying problem statement.