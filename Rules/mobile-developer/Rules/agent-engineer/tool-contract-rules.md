# Tool Contract Rules
## Purpose
Make tool use predictable and safe.
## Scope
Tool schemas, inputs, outputs, errors, and side effects.
## MUST
- Define typed, unambiguous tool inputs and outputs with explicit error semantics.
- Validate tool arguments before execution and validate critical outputs before consumption.
- Document whether each tool is read-only, reversible, destructive, or externally visible.
## MUST NOT
- Expose broader capability than the agent requires.
- Treat malformed or ambiguous tool output as successful execution.
## SHOULD
- Design tools to be narrow, idempotent where practical, and easy to test independently.
## Exceptions
Broader tools require necessity, compensating controls, monitoring, and approval.
## Verification
Inspect schemas, permission scopes, validation tests, error tests, and side-effect classifications.