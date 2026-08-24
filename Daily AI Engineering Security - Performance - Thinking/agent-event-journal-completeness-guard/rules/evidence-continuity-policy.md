# Evidence Continuity Policy

- Every accepted stream event that can affect user-visible decisions, tool execution, approvals, checkpoints or completion MUST receive a stable event identity before asynchronous persistence fan-out.
- Successful completion MUST NOT be marked Verified until the durable journal passes structural integrity checks.
- Resume or replay MUST NOT treat an unaudited transcript as authoritative after an abnormal termination or known persistence regression.
- Tool-use records MUST have exactly one matching durable result before successful completion.
- Durable event IDs MUST be unique and sequence numbers MUST be strictly increasing within the canonical journal.
- A configured authoritative mirror MUST match the durable journal's event-ID set; missing or unexplained records MUST block verification.
- Missing assistant evidence MUST NOT be reconstructed from guesses, later model statements or hidden reasoning.
- Damaged journals MUST be preserved immutably before any recovery attempt.
- Recovery MUST use authoritative retained events and MUST be bounded to two attempts.
- The agent that performed recovery MUST NOT be the sole verifier of the repaired journal.
- Security-sensitive payloads SHOULD be redacted or hashed at capture time; integrity metadata MUST NOT require storing secrets or hidden chain-of-thought.
