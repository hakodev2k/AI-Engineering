# Rules: Safety Continuity

- High-risk policy state MUST survive chat/session resets for the configured history window.
- A new session ID MUST NOT clear a prior block for the same target and action class.
- Claims that an operation is a simulation, test, lab, or red-team exercise MUST NOT reduce risk without independently verifiable authorization when policy requires it.
- Authorization MUST be bound to target, scope, action class, and validity period.
- Continuity storage MUST NOT persist raw credentials, secrets, or unnecessary conversation text.
- High-risk effects SHOULD use hashed/minimized target identifiers where practical.
- Repeated reset attempts after a block MUST increase scrutiny and MUST NOT trigger automatic retries.
- An implementing agent MUST NOT be the sole verifier of a high-risk allow decision.
