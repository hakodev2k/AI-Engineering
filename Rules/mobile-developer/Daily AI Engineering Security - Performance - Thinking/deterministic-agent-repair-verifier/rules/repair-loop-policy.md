# Rules: Deterministic Repair Loop

1. Every autonomous task MUST have observable acceptance criteria before a final success claim.
2. The agent MUST check whether the target state is already satisfied before mutating the environment.
3. Facts, assumptions, hypotheses, and conclusions MUST be represented separately in repair evidence.
4. A failed tool call MUST produce an explicit typed failure event; the workflow MUST NOT silently hang.
5. A retry MUST address a failed predicate, missing required call, or changed hypothesis.
6. Identical attempt fingerprints MUST NOT be repeated beyond the configured duplicate limit without new external evidence.
7. Every retry SHOULD include failure location, observed value, expected value, and admissible alternatives when known.
8. Required-call coverage MUST be checked before success when those calls provide necessary completion evidence.
9. The implementing agent MUST NOT be the only verifier for high-risk changes.
10. A textual agent claim MUST NOT override failed deterministic checks.
11. Retry loops MUST be bounded by `config/policy.json`.
12. When retry budget is exhausted, the workflow MUST stop and preserve failure evidence.
13. Dangerous or irreversible repair actions MUST require explicit human approval.
14. Verification MUST NOT be weakened merely to obtain a successful completion state.
15. Unknown failures SHOULD receive at most one diagnostic retry before escalation unless new evidence materially changes the hypothesis.