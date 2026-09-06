# Model Serving Contract Rules

## Purpose
Define stable, explicit contracts between inference services and their consumers.

## Scope
Request/response schemas, model identifiers, versions, timeouts, errors, streaming semantics, and compatibility.

## MUST
- Every production endpoint MUST define request schema, response schema, model/version identity, timeout behavior, and error semantics.
- Consumer-visible changes MUST be classified as backward-compatible or breaking before release.
- Streaming endpoints MUST define ordering, completion, cancellation, and partial-failure behavior.
- Defaults, truncation, token limits, and unsupported parameters MUST be explicit.
- Breaking changes MUST include migration and consumer validation plans.

## MUST NOT
- MUST NOT silently repurpose a field or change its semantic meaning.
- MUST NOT return success for requests that were only partially processed unless partial completion is part of the documented contract.
- MUST NOT expose internal stack traces or sensitive backend details to clients.

## SHOULD
- Contracts SHOULD be machine-readable and validated in CI.
- Deprecations SHOULD include replacement guidance and a sunset window.

## Exceptions
Exceptions require documented impact, affected consumers, risk, migration plan, and approval.

## Verification
Inspect API schemas, compatibility tests, integration tests, and deployment diffs.