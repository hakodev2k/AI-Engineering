# Prompt and Model Compatibility Rules

## Purpose
Ensure prompts and request formats remain valid across routable models and providers.

## Scope
System instructions, message formats, structured output, tool schemas, stop behavior, sampling parameters, and provider adapters.

## MUST
- Each route MUST use a prompt/request contract validated for every eligible target.
- Provider adapters MUST normalize only semantics that can be preserved safely.
- Unsupported parameters MUST be rejected, translated deliberately, or removed with documented behavior.
- Structured-output and tool-call routes MUST have compatibility tests for every production target.
- Prompt changes MUST be evaluated across the target set they can reach.

## MUST NOT
- MUST NOT assume identical system-message precedence or tool semantics across providers.
- MUST NOT silently change user-visible output contracts during provider fallback.
- MUST NOT send provider-specific private parameters to incompatible targets.

## SHOULD
- Centralize compatibility adapters rather than duplicating ad hoc conversions.
- Keep target-specific prompt variants minimal and versioned.

## Exceptions
Exceptions require explicit target scoping, rationale, and regression evidence.

## Verification
Review adapter tests, prompt snapshots, structured-output tests, tool-call integration tests, and route matrices.