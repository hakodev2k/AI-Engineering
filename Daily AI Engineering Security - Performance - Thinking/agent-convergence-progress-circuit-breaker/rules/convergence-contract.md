# Rules: Agent Convergence Contract

- Every finite autonomous task MUST have explicit required acceptance rows before long-running execution begins.
- Progress MUST be measured from observable artifact, evidence, or acceptance-state deltas; tool activity alone MUST NOT count as progress.
- New work MUST reference an existing failed acceptance row or an explicitly approved scope change.
- Automatic continuation MUST stop when the configured no-progress budget is exceeded.
- Review or verification retries MUST be bounded and MUST NOT repeat a passing check without new invalidating evidence.
- Finalization MUST NOT occur while required acceptance rows remain open.
- A blocked run SHOULD expose the exact blocking acceptance row and current evidence rather than emitting generic continuation text.
- Recovery MUST preserve security, correctness and required verification; the system MUST NOT weaken a gate merely to claim convergence.
- Implementers MUST NOT be the sole verifier for high-risk or production-affecting changes.
- Checkpoints MUST be durable enough to resume without re-expanding already-closed work.
