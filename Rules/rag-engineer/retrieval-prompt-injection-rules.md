# Retrieval Prompt Injection Rules

## Purpose
Treat retrieved content as untrusted data and prevent it from altering application control behavior.

## Scope
Indexed documents, web content, tool outputs, context formatting, instruction boundaries, and adversarial content.

## MUST
- Retrieved content MUST be treated as untrusted input regardless of source reputation.
- Application instructions MUST remain structurally distinct from retrieved evidence.
- Systems MUST test adversarial documents that attempt to redirect behavior, request secrets, or override policies.
- Tool execution decisions MUST use trusted application logic rather than instructions found only in retrieved text.
- Security-relevant retrieval failures MUST be logged without exposing sensitive payloads.

## MUST NOT
- MUST NOT grant retrieved text authority to change access controls or system policy.
- MUST NOT expose secrets because retrieved content requests them.
- MUST NOT suppress security filters merely to improve answer completeness.

## SHOULD
- Use content sanitization and provenance-aware defenses where useful.
- Maintain adversarial regression sets.

## Exceptions
None for authority boundaries; product-specific handling may vary only within those boundaries.

## Verification
Run injection suites, tool-boundary tests, secret-exposure tests, and manual adversarial review.