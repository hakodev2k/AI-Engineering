# Prompt Injection Defense

## Purpose
Reduce the probability and impact of direct and indirect prompt injection in LLM applications.

## When to use
Use whenever untrusted text can enter model context, especially with retrieval, browsing, email, documents, or tools.

## Inputs
Prompt construction, retrieval pipeline, tool definitions, permission model, data-flow diagram, attack examples.

## Context to inspect
Instruction hierarchy, untrusted-content boundaries, tool authorization, output handling, secret exposure, and side effects.

## Core knowledge
Prompt injection cannot be solved reliably by wording alone. Treat model-consumed external content as untrusted data and constrain downstream capabilities independently.

## Procedure
1. Identify all attacker-controlled context sources.
2. Separate trusted instructions from untrusted content structurally where possible.
3. Minimize secrets and privileged data in model context.
4. Enforce tool permissions outside the model.
5. Validate arguments and destinations for sensitive actions.
6. Add confirmation for consequential operations.
7. Detect suspicious instruction-like content as a defense-in-depth signal.
8. Test direct and indirect injection variants.
9. Monitor attempted bypasses and unexpected tool sequences.

## Decision points
If an action is irreversible or high impact, require deterministic authorization or human confirmation rather than model judgment alone.

## Common failure patterns
Relying on system prompts as a sandbox; letting retrieved text redefine policy; exposing credentials; allowing arbitrary URLs or commands.

## Verification
Demonstrate that successful instruction manipulation still cannot cross authorization, data-access, or side-effect boundaries.

## Expected output
Layered injection defenses with explicit trust boundaries and adversarial test evidence.

## Stop conditions
Stop release if untrusted content can trigger unauthorized privileged actions or disclose protected data.