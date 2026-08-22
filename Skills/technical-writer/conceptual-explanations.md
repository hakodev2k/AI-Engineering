# Conceptual Explanations

## Purpose
Build accurate mental models that help users reason about behavior, architecture, constraints, and trade-offs.
## When to use
Use when users can follow steps but need to understand why the system behaves as it does.
## Inputs
Domain model, architecture, product semantics, user misconceptions, examples.
## Context to inspect
Design docs, implementation, terminology, support questions, diagrams, competing concepts.
## Core knowledge
Explanation answers why and how concepts relate. It should simplify without creating false rules that fail in production.
## Procedure
1. Identify the misconception or reasoning task.
2. Define the concept in user-domain language.
3. Explain relationships and invariants.
4. Use a minimal concrete example.
5. Contrast commonly confused concepts.
6. State boundaries and exceptions.
7. Add diagrams only when they improve comprehension.
8. Link to tutorials, how-tos, and reference instead of duplicating them.
## Decision points
Use analogy only when mapping is explicit and limitations are stated; prefer exact models for security or distributed behavior.
## Common failure patterns
Marketing prose, unexplained jargon, inaccurate analogies, architecture dumps, and mixing procedures into conceptual pages.
## Verification
Domain experts confirm accuracy and target users can predict representative behavior after reading.
## Expected output
A concise, durable mental model.
## Stop conditions
Escalate unresolved architecture or semantic disagreement before presenting it as fact.