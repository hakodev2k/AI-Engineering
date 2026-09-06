# Context Priority Rules

## Purpose
Ensure higher-authority and higher-value information wins when context sources conflict or compete for limited tokens.

## Scope
Instruction hierarchy, source precedence, recency, authority, and conflict resolution.

## MUST
- Context assembly MUST define deterministic precedence among system guidance, project policy, user input, trusted data, and untrusted retrieved content.
- Conflicting authoritative sources MUST be surfaced or resolved by an explicit policy.
- Higher-priority instructions MUST remain identifiable after serialization.
- Priority decisions MUST be stable across equivalent requests.

## MUST NOT
- Retrieved content MUST NOT override higher-authority instructions merely because it appears later.
- Recency MUST NOT automatically outweigh source authority.
- Priority MUST NOT depend on undocumented prompt ordering side effects.

## SHOULD
- Prefer explicit priority metadata over positional conventions.
- Conflict-resolution logic SHOULD be covered by regression tests.

## Exceptions
Exceptions require documented rationale and evidence that the alternative ordering is safer or more correct.

## Verification
Inspect assembly code, serialized contexts, adversarial conflict tests, and regression suites.