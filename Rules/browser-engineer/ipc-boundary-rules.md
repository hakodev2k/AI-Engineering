# IPC Boundary Rules
## Purpose
Keep inter-process communication explicit, validated, and resilient to compromised peers.
## Scope
Messages, serialization, handles, capabilities, routing, and process trust boundaries.
## MUST
- Every message from a less-trusted process MUST be treated as attacker-controlled input.
- Receivers MUST validate identity, bounds, state transitions, and capability authorization before acting.
- Protocol changes MUST define compatibility and failure behavior.
## MUST NOT
- MUST NOT deserialize unchecked sizes or identifiers into privileged operations.
- MUST NOT assume sender-side validation is sufficient.
## SHOULD
- SHOULD use narrow typed messages rather than generic command channels.
## Exceptions
Broader interfaces require threat analysis and security review.
## Verification
Use malformed-message tests, fuzzing, compromised-renderer simulations, static analysis, and protocol review.