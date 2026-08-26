# Rules: Verification Claims
- A completion claim MUST be backed by a passing verification record for the exact current revision.
- Evidence from an older or different revision MUST NOT be accepted.
- The newest applicable failing or blocked record MUST supersede older passing evidence.
- Verification evidence MUST include revision, command, status, timestamp and evidence ID.
- A verification rerun SHOULD NOT occur when a fresh passing evidence key already satisfies the same revision and required command set.
- An unchanged revision MUST NOT trigger more than two verification executions without human escalation.
- A code change after verification MUST invalidate the prior completion gate.
- Verification logs MUST NOT contain secrets.
- The implementing agent MUST NOT be the sole verifier for high-risk changes.
