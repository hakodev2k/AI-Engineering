# Prompt Engineering

## Purpose
Design prompts that make model behavior explicit, testable, maintainable, and robust across realistic inputs.

## When to use
Use when implementing or revising model instructions, structured generation, tool use, extraction, classification, summarization, or reasoning workflows.

## Inputs
Task definition, examples, model capabilities, output schema, constraints, evaluation cases, safety policy, surrounding application logic.

## Preconditions
Separate requirements that belong in deterministic code from behavior that genuinely requires model interpretation.

## Context to inspect
System and developer instructions, user input shape, tool schemas, conversation state, output parsers, retry logic, model settings, known failures.

## Core knowledge
Prompts are executable specifications for probabilistic systems. Strong prompts define role, objective, inputs, constraints, output contract, priorities, examples, and failure behavior. Avoid relying on hidden wording tricks; correctness should come from clear instructions plus evaluation.

## Procedure
1. State the user outcome and model responsibility precisely.
2. Remove requirements better enforced by code or schemas.
3. Define instruction priority and non-negotiable constraints.
4. Specify input boundaries and how untrusted content must be treated.
5. Define an explicit output format or schema.
6. Add only examples that teach important distinctions.
7. Explain what to do when evidence is missing or conflicting.
8. Test against representative, edge, ambiguous, and adversarial inputs.
9. Inspect failures and revise the smallest relevant instruction.
10. Version prompts and keep evaluation results with changes.

## Decision points
Use few-shot examples when rules are difficult to express directly. Use structured output when downstream code needs machine reliability. Prefer multiple specialized prompts over one enormous prompt when responsibilities are separable.

## Common failure patterns
Conflicting instructions, giant prompts with weak hierarchy, leaking untrusted text into instructions, asking the model to enforce security boundaries, brittle formatting, excessive examples, and changing prompts without regression tests.

## Verification
Run prompt regression evaluations, validate schema conformance, compare quality and token cost against the previous version, and inspect adversarial cases.

## Expected output
A concise, versioned prompt with explicit behavior and measurable evaluation evidence.

## Stop conditions
Stop when task ownership is unclear, security depends on prompt obedience alone, or no representative examples exist to validate the change.