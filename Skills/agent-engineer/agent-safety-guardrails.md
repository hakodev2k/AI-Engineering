# Agent Safety and Guardrails

## Purpose
Constrain agent behavior so mistakes, adversarial inputs, and model uncertainty cannot freely become harmful actions.

## When to use
Use for every production agent, with stronger controls for privileged or externally acting systems.

## Inputs
Threat model, tools, permissions, data classes, policy constraints, risk tolerance.

## Context to inspect
Instruction boundaries, tool authorization, external content, logging, approval gates, runtime isolation, and fallback behavior.

## Core knowledge
Guardrails require defense in depth: model instructions, deterministic validation, authorization, isolation, rate/budget limits, and human control. Prompt instructions alone are not a security boundary.

## Procedure
1. Enumerate harmful or unauthorized outcomes.
2. Minimize tools and privileges.
3. Validate tool arguments outside the model.
4. Isolate untrusted content from instructions.
5. Add allowlists, budgets, rate limits, and timeouts.
6. Require approval for high-impact actions.
7. Sanitize outputs crossing trust boundaries.
8. Log security-relevant decisions without leaking secrets.
9. Test adversarial and confused-deputy scenarios.
10. Define fail-closed behavior where appropriate.

## Decision points
Use deterministic enforcement for hard policy; model classifiers only as supplemental controls where uncertainty is acceptable.

## Common failure patterns
Prompt-only security, broad credentials, implicit trust of retrieved content, unrestricted shell/network access, and fail-open errors.

## Verification
Demonstrate denied actions stay denied under adversarial prompts, tool misuse, malformed data, and dependency failures.

## Expected output
A layered control design mapped to concrete risks and tests.

## Stop conditions
Stop deployment when critical actions lack enforceable authorization or containment.