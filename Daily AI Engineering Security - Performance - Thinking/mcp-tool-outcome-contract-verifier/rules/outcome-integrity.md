# Outcome Integrity Rules

1. A tool result with `isError=true` **MUST NOT** be normalized to success/completed.
2. A known permission/authentication denial **MUST** be normalized to failure even if a transport wrapper returns ordinary content.
3. Transport/JSON-RPC completion **MUST NOT** be treated as proof of application-level success.
4. Unknown outcomes for non-idempotent actions **MUST NOT** be automatically retried.
5. Consequential writes **MUST** carry verification evidence before an agent declares the goal complete when the tool contract permits response/side-effect divergence.
6. Error-string parsing **SHOULD** be a fallback diagnostic, not the primary status contract.
7. Raw protocol and runtime evidence **MUST** be retained for contradictory outcomes.
8. Integration tests **MUST** include success, denied, validation failure, thrown failure and unknown/timeout fixtures.
9. Retry loops **MUST** be bounded and conditioned on idempotency/outcome knowledge.
10. The implementing agent **MUST NOT** be the sole verifier of a high-impact outcome-mapping change.
11. Missing outcome evidence **MUST** remain unknown; it **MUST NOT** be coerced to success.
12. A completion claim **MUST** be supported by observable tool/state evidence, not hidden reasoning.