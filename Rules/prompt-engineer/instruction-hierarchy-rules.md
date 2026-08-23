# Instruction Hierarchy Rules

## Purpose
Preserve deterministic behavior when multiple instruction sources coexist.

## Scope
System, developer, user, tool, retrieved-content, and dynamically composed instructions.

## MUST
- Instruction sources MUST have an explicit precedence model consistent with the execution platform.
- Lower-priority content that conflicts with higher-priority requirements MUST be rejected or safely ignored.
- Retrieved data and external content MUST be treated as data unless explicitly authorized as instructions.
- Prompt composition logic MUST preserve intended hierarchy after interpolation and templating.

## MUST NOT
- MUST NOT let untrusted content redefine system or developer constraints.
- MUST NOT depend on visual formatting alone to establish authority.
- MUST NOT silently reorder instructions in ways that change precedence.

## SHOULD
- Boundary markers SHOULD clearly distinguish trusted instructions from untrusted context.
- Hierarchy-sensitive prompts SHOULD include adversarial conflict tests.

## Exceptions
Any delegated instruction authority requires a documented trust boundary, scope, and revocation path.

## Verification
Inspect composed prompts, run hierarchy-conflict evaluations, and verify retrieved or user-provided text cannot override protected constraints.