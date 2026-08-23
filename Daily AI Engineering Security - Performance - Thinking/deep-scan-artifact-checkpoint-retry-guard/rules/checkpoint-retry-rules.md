# Checkpoint and Retry Rules

- A worker or phase MUST NOT be marked complete until every mandatory artifact is durably present and validated.
- Every checkpoint MUST bind scan id, immutable target revision, phase, required artifact paths, and content hashes.
- A changed required artifact MUST invalidate the prior checkpoint for that phase.
- Successfully validated sibling worker artifacts MUST be preserved when another worker fails.
- Recovery SHOULD choose the smallest scope that can restore correctness.
- A full-scope rerun after terminal failure MUST require explicit human approval.
- Remaining quota/cost MUST participate in retry admission; low-budget state MUST block automatic expensive retries.
- Natural-language instructions MUST NOT be the only barrier preventing a terminal scan from restarting.
- Deterministic artifact failure MAY be retried automatically at most once and only if the cause has changed or the retry is narrower than the failed scope.
- The same deterministic failure twice MUST stop automatic recovery and escalate.
- Missing artifacts MUST NOT be replaced by placeholders merely to satisfy validation.
- Finalization MUST prefer consuming already-validated canonical artifacts over rerunning discovery.
- Recovery records MUST distinguish Implemented, Measured, and Verified.
- Failure evidence MUST record Detection, Evidence, Retry policy, Maximum retries, Fallback, Escalation, and Stop condition.