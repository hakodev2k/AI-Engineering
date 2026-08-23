# Prompt Architecture

## Purpose
Structure complex prompts so instructions, context, tools, constraints, and outputs remain understandable and reliable.

## When to use
Use for multi-step prompts, agent instructions, or prompts with many interacting constraints.

## Inputs
Task, rules, context sources, tools, output schema, and failure cases.

## Preconditions
Know which behavior must be deterministic and which requires model judgment.

## Context to inspect
Existing prompt structure, tool definitions, model limits, retrieval boundaries, and downstream validation.

## Core knowledge
Separate role, objective, context, rules, procedure, decision criteria, and output contract. Put high-priority constraints where they are easy to identify and avoid contradictory instructions.

## Procedure
1. Define the primary outcome.
2. Separate immutable constraints from guidance.
3. Group related instructions.
4. Define required context and tool usage.
5. Specify procedure and decision points.
6. Define output schema and validation.
7. Remove duplicate or conflicting instructions.
8. Test with normal, ambiguous, and adversarial inputs.

## Decision points
Use structured sections for complex tasks; keep simple tasks concise. Prefer schemas or code for strict formats. Split independent stages when one prompt becomes difficult to validate.

## Common failure patterns
Conflicting priorities; repeated rules; unclear ownership of decisions; burying critical constraints; mixing examples with requirements.

## Verification
A reviewer can identify objective, constraints, inputs, procedure, output, and escalation rules without guessing.

## Expected output
A maintainable prompt with clear instruction boundaries and testable behavior.

## Stop conditions
Stop when requirements cannot be reconciled or prompt behavior depends on unavailable tools or context.