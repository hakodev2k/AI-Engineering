# Diagrams and Visual Communication

## Purpose
Use diagrams to clarify relationships, flows, boundaries, states, and architecture that are harder to understand in prose alone.
## When to use
Use for system context, workflows, sequences, state transitions, data flows, and conceptual relationships.
## Inputs
Verified model, audience, key message, notation constraints, source format.
## Context to inspect
Existing diagrams, terminology, architecture, accessibility, rendering platform, versioning.
## Core knowledge
A diagram should answer a question. Minimize visual vocabulary, label boundaries explicitly, and keep source maintainable where possible.
## Procedure
1. Define the single question the diagram answers.
2. Select appropriate form: context, flow, sequence, state, data, or component.
3. Include only elements needed for that question.
4. Use consistent labels, direction, and notation.
5. Mark trust/system/ownership boundaries where meaningful.
6. Add legend only when notation is not self-evident.
7. Provide textual equivalent/context for accessibility.
8. Store editable source and version it with docs.
9. Validate semantics with domain/technical owners.
## Decision points
Prefer text for simple sequences; diagrams when spatial relationships materially reduce cognitive load.
## Common failure patterns
Decorative complexity, unlabeled arrows, mixed abstraction levels, screenshots of diagrams, and stale architecture pictures.
## Verification
Target readers can explain the intended relationship correctly and experts confirm accuracy.
## Expected output
Focused, accessible, maintainable technical visuals.
## Stop conditions
Stop when the underlying model is disputed or cannot be verified.