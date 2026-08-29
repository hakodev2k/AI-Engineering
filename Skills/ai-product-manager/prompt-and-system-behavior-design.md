# Prompt and System Behavior Design

## Purpose
Specify AI system behavior at the product level so prompts, policies, tool use, retrieval, and UX jointly produce predictable outcomes.

## When to use
Use when defining a new assistant behavior, improving consistency, or translating product requirements into system instructions and workflow rules.

## Inputs
User goals, product policies, model capabilities, tool contracts, retrieval context, tone requirements, failure constraints, eval cases.

## Context to inspect
Existing system prompts, tool schemas, conversation state, safety controls, response rendering, fallback behavior, and known failures.

## Core knowledge
Prompting is only one control layer. Reliable behavior often requires structured context, tool constraints, validators, state management, and UX that exposes uncertainty.

## Procedure
1. Define the job the model performs and explicit non-goals.
2. Separate policy, task instructions, context, examples, and user input.
3. Define when tools or retrieval are required.
4. Specify output structure and uncertainty behavior.
5. Define conflict precedence and refusal/escalation rules.
6. Minimize instructions that cannot be evaluated.
7. Test against representative, ambiguous, adversarial, and long-context cases.
8. Compare changes with the established eval baseline.

## Decision points
Use deterministic application logic for hard business rules. Use prompts for flexible language behavior and model reasoning that tolerates probabilistic variation.

## Common failure patterns
Prompt-only enforcement of critical rules, contradictory instructions, overly long prompts, brittle examples, and no regression suite.

## Verification
Verify behavior through task and safety evals and inspect failures rather than judging a few hand-picked conversations.

## Expected output
A behavior specification and validated prompt/workflow changes with known limitations.

## Stop conditions
Stop when requested behavior conflicts with safety, policy, legal requirements, or cannot be reliably evaluated.