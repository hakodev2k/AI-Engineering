# Serving Contract Rules
## Purpose
Keep inference interfaces stable, validated, and diagnosable.
## Scope
Online, batch, streaming, and embedded inference contracts.
## MUST
- Define input schema, output semantics, versioning, validation, timeout, and failure behavior.
- Validate required features before inference and expose explicit errors for invalid requests.
- Coordinate breaking contract changes with consumers.
## MUST NOT
- Silently reinterpret fields or output semantics under the same contract version.
- Return fabricated predictions when required inputs are invalid.
## SHOULD
- Keep model-specific internals behind stable serving interfaces.
## Exceptions
Breaking changes require migration plan, consumer impact review, and approval.
## Verification
Run contract, compatibility, invalid-input, timeout, and consumer integration tests.