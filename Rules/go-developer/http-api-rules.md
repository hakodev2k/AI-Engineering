# HTTP API Rules

## Purpose
Protect correctness and compatibility of Go HTTP services.

## Scope
Handlers, routing, request parsing, response writing, middleware, and public HTTP contracts.

## MUST
- Request data MUST be validated before business effects occur.
- Status codes, headers, and response schemas MUST follow the documented contract.
- Request bodies MUST have appropriate size limits for exposed endpoints.
- Public contract changes MUST be reviewed for backward compatibility.
- Handlers MUST propagate request cancellation to downstream work.

## MUST NOT
- MUST NOT expose internal errors, stack traces, or secrets to clients.
- MUST NOT write multiple conflicting responses after headers are committed.
- MUST NOT accept ambiguous duplicate or unknown fields when contract strictness requires rejection.

## SHOULD
- Separate transport parsing from domain logic.
- Use consistent structured error responses.

## Exceptions
Compatibility deviations require consumer impact analysis, migration strategy, and approval.

## Verification
Contract tests, integration tests, fuzzing of parsers, API diff checks, and security review.