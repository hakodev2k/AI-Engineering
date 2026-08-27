# Rules: Approval Integrity

- Approval MUST bind to an immutable fingerprint of the exact executable leaf tool and parsed arguments.
- Approval MUST NOT authorize a different nested tool, argument set, destination, or consequence class.
- Missing, defaulted, or unparseable approval-relevant input MUST block high-risk execution.
- Delegation wrappers MUST preserve and display the leaf tool identity.
- High-risk approvals MUST include a human-readable consequence summary and destination/scope.
- Execution MUST recompute the approval fingerprint immediately before side effects.
- A fingerprint mismatch MUST block execution and MUST NOT be silently repaired.
- Tool-name allowlists MUST NOT substitute for argument- and destination-level authorization.
- Logs MUST record reason codes and fingerprints but MUST NOT record secrets.
- The implementing agent MUST NOT be the sole verifier for high-risk approval changes.
