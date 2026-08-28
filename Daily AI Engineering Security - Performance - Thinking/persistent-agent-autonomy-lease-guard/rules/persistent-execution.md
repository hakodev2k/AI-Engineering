# Rules: Persistent Execution

- Persistent execution MUST have a finite lease expiry.
- A lease MUST bind to the currently approved goal identity.
- A lease MUST NOT grant permissions beyond existing security/tool policy.
- Consequential side effects MUST be counted against a finite per-lease budget.
- Checkpoint age and evidence age MUST be checked before consequential actions.
- Lease renewal MUST require externally observable progress, not self-reported reasoning.
- Automatic renewal MUST be bounded; after the configured limit, human or independent review is required.
- Goal changes MUST invalidate the existing lease.
- Dangerous or irreversible actions MUST still require explicit human approval when policy requires it.
- A stopped or expired lease MUST fail closed and MUST NOT be bypassed by spawning a child agent.
- Verification SHOULD use Facts, Evidence, Decision, Risks, and Verification Status; hidden chain-of-thought MUST NOT be requested.
