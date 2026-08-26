# Request and Response Transformation

## Purpose
Keep gateway transformations explicit, deterministic, compatible, and safe.

## Scope
Headers, paths, query parameters, bodies, status mapping, protocol adaptation, and normalization.

## MUST
- Every transformation MUST have a documented contract purpose and deterministic behavior.
- Input validation MUST occur before transformations that assume structure or trust.
- Transformations affecting signed or security-sensitive data MUST preserve the applicable trust model.
- Error transformations MUST retain enough diagnostic correlation for investigation without exposing sensitive internals.

## MUST NOT
- MUST NOT silently discard required fields.
- MUST NOT inject trusted identity from unvalidated client input.
- MUST NOT transform failures into success responses merely to simplify clients.

## SHOULD
- Complex transformations SHOULD be moved to an owned service when they become domain logic.
- Transformations SHOULD have fixture-based tests for edge cases.

## Exceptions
Exceptions require contract analysis, security review where relevant, and explicit verification evidence.

## Verification
Use golden request/response tests, schema validation, negative-input tests, security review, and end-to-end contract tests.