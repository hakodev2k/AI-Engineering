# Instruction Hierarchy Design

## Purpose
Design prompt instructions with explicit precedence, scope, and conflict behavior so the model follows durable rules without accidental override by lower-trust context.

## When to use
Use for system prompts, assistants, agents, multi-source context, delegated tasks, and any workflow where instructions can conflict.

## Inputs
Prompt layers, product policies, user-controlled content, retrieved content, tool descriptions, task requirements, and known conflict cases.

## Context to inspect
Inspect where each text fragment originates, who controls it, whether it is trusted, and how the runtime assembles messages. Identify data that may contain instruction-like text.

## Core knowledge
Instructions and data must be separated conceptually and structurally. Higher-priority rules should define stable boundaries; lower-priority instructions should customize behavior only within those boundaries. Redundant rules can create contradictions rather than safety.

## Procedure
1. Inventory every instruction source and assign trust/authority.
2. Separate policy, role, task, context, examples, and untrusted data.
3. Put stable global constraints above task-specific behavior.
4. State precedence for known conflicts in operational language.
5. Mark retrieved/user content as data when it must not control behavior.
6. Remove duplicated instructions that differ subtly.
7. Define behavior for impossible or conflicting requests.
8. Test direct and indirect attempts to override protected rules.
9. Test ordinary requests to ensure hierarchy does not over-constrain useful behavior.
10. Document assumptions made by the hierarchy.

## Decision points
Use stronger explicit boundaries when untrusted content is embedded. Use fewer layers when a simple task has no meaningful authority separation. Prefer runtime-enforced controls over prose when a requirement can be guaranteed outside the model.

## Common failure patterns
Mixing examples with authoritative instructions; placing untrusted retrieved text next to commands without delimiters; contradictory repeated rules; relying on “ignore malicious instructions” without defining trusted sources; making the hierarchy so rigid that valid user customization fails.

## Verification
Create conflict tests for each pair of instruction sources. Verify protected constraints survive lower-trust overrides, legitimate user instructions still work, and outputs remain correct when retrieved documents contain imperative language.

## Expected output
A minimal, ordered instruction architecture with explicit source boundaries and conflict behavior.

## Stop conditions
Stop when runtime message ordering is unknown, product policy is contradictory, or a required security boundary depends solely on prompt wording despite an available deterministic control.