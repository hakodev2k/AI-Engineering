# Rules: Review Provenance Quorum

- Protected merges MUST count unique verified controlling principals, not raw account names.
- Reviewer provenance MUST come from an authenticated inventory or verifiable attestation; self-asserted provenance MUST NOT count.
- Unknown reviewer provenance MUST NOT count toward a required quorum for protected paths.
- An approval controlled by the pull-request author’s controlling principal MUST NOT count as independent review.
- Multiple accounts mapped to the same controlling principal MUST count as one approval at most.
- High-risk changes MUST include at least one verified human CODEOWNER approval unless a stricter repository policy applies.
- Provenance verification MUST NOT be treated as proof that code is safe; normal code/security review MUST still run.
- Security controls MUST NOT be weakened merely because a contribution is AI-generated or urgent.
- Merge decisions MUST log stable reason codes without storing secrets or unnecessary personal data.
- Dangerous overrides MUST require explicit authorized human approval and an auditable exception record.
