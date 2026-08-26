# Safety Policy Prompting

## Purpose
Translate approved product safety policy into clear model behavior while preserving useful responses within allowed boundaries.

## When to use
Use when an AI feature has content, privacy, action, or domain restrictions that the model must apply conversationally.

## Inputs
Authoritative policy, risk taxonomy, allowed transformations, refusal/escalation rules, and safety evals.

## Context to inspect
Inspect runtime safety controls, moderation layers, tool permissions, policy version, and known over/under-refusal cases.

## Core knowledge
Prompts are one layer of safety, not the sole enforcement mechanism. Policies should be operationalized around observable request characteristics and permitted behavior, not vague moral language.

## Procedure
1. Identify authoritative policy and version.
2. Convert policy categories into behavioral rules and exceptions.
3. Define safe alternatives or partial assistance where policy allows.
4. Separate model guidance from deterministic enforcement.
5. Resolve overlap and precedence between policy categories.
6. Add examples only for ambiguous boundaries.
7. Test benign near-boundary, clearly disallowed, obfuscated, multilingual, and transformation requests.
8. Measure both unsafe compliance and unnecessary refusal.
9. Review regressions with policy owners.
10. Version prompt and safety evals together.

## Decision points
Use deterministic blocking for enforceable hard boundaries; prompt-level nuanced handling where semantic judgment is required. Prefer calibrated partial assistance over blanket refusal when policy permits.

## Common failure patterns
Inventing policy; excessive refusal; examples becoming loopholes; policy text copied verbatim without operational rules; prompt-only enforcement of privileged actions.

## Verification
Safety evals meet thresholds for violation and over-refusal rates, and runtime controls independently enforce critical boundaries.

## Expected output
Operational safety instructions, edge-case behavior, eval suite, and residual-risk notes.

## Stop conditions
Stop if policy is missing/contradictory, legal interpretation is required, or a critical boundary cannot be enforced reliably.