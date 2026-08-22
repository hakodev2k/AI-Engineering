# Prompt and Instruction Engineering

## Purpose
Create maintainable instructions that reliably steer agents without relying on brittle phrasing.

## When to use
Use for system prompts, role instructions, tool guidance, policies, and task templates.

## Inputs
Desired behavior, prohibited behavior, examples, tools, output contract, evaluation cases.

## Context to inspect
Instruction hierarchy, runtime-injected context, model limits, tool descriptions, user inputs, and failure traces.

## Core knowledge
Clear objectives, precedence, constraints, examples, and output contracts matter more than decorative prose. Prompts are executable configuration and require versioning and evaluation.

## Procedure
1. Define observable desired behavior.
2. Separate invariant policy from task-specific context.
3. State precedence and conflict handling.
4. Specify tool-use and stopping rules.
5. Define output constraints only where needed.
6. Add examples for genuinely ambiguous behavior.
7. Remove duplication and contradictory instructions.
8. Test against representative and adversarial cases.
9. Compare revisions with a fixed evaluation set.
10. Version and document meaningful changes.

## Decision points
Use examples when rules alone remain ambiguous. Move deterministic validation into code rather than growing prompts indefinitely.

## Common failure patterns
Prompt accretion, conflicting rules, vague success criteria, excessive formatting constraints, hidden assumptions, and tuning against one example.

## Verification
Run regression evaluations for compliance, task quality, tool choice, injection resistance, latency, and token usage.

## Expected output
A concise versioned instruction set plus evaluation evidence.

## Stop conditions
Stop when requirements conflict or behavior depends on guarantees the selected model cannot provide.