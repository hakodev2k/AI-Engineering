# Prompt Injection Defense

## Purpose
Reduce direct and indirect prompt-injection risk.

## When to use
Use for chat, RAG, browsing, documents, email, repositories, and tool outputs with untrusted language.

## Inputs
Prompt stack, retrieval, tools, trust labels, attacks, authorization.

## Context to inspect
Inspect hierarchy, external content, metadata, memory, planning, privileged operations.

## Core knowledge
Instruction-only defenses are insufficient. Reduce untrusted authority, separate data/instructions, restrict capabilities, independently validate actions.

## Procedure
1. Inventory instruction channels.
2. Label trust.
3. Minimize privileged context exposure.
4. Delimit external data.
5. Prevent policy/permission changes from content.
6. Independently authorize actions.
7. Validate tool arguments.
8. Use injection detection as a signal.
9. Test encoded/multilingual/multi-turn attacks.
10. Monitor overrides.

## Decision points
Prefer typed extraction then separately constrained decisions.

## Common failure patterns
Keyword lists, delimiter-only defense, secrets in prompts, document-granted permissions, refusal-only boundary.

## Verification
Adversarial tests cannot obtain unauthorized data/actions.

## Expected output
Hardened context/action flow and regressions.

## Stop conditions
Escalate direct untrusted control of privileged execution.