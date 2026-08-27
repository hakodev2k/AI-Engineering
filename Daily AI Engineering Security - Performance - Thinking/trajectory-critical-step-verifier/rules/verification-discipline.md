# Rules: Verification Discipline for Long-Horizon Agents

- Every consequential progress or completion claim MUST cite observable evidence IDs.
- Facts, assumptions, hypotheses, decisions, and verification results MUST remain distinguishable in artifacts.
- Active assumptions MUST have stable IDs and MUST be explicitly resolved, rejected, or carried forward.
- A trajectory MUST NOT exceed the configured maximum unverified span without a checkpoint.
- Failed verification MUST trigger re-evaluation from the last verified checkpoint; it MUST NOT trigger blind continuation.
- Completion MUST NOT be accepted while critical assumptions remain unresolved.
- The implementing agent MUST NOT be the sole verifier for high-impact or long-horizon completion.
- Verification SHOULD prefer deterministic tests, artifact inspection, and independent reproduction over narrative self-assessment.
- Retry loops MUST be bounded; the default maximum is 2 recovery attempts per diagnosed failure.
- A verifier MUST NOT weaken acceptance criteria merely to make a run pass.
- Original traces and evidence MUST be preserved during recovery so root-cause analysis remains auditable.
