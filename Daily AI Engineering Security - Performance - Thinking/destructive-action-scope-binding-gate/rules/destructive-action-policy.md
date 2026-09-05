# Destructive Action Policy

1. Destructive actions **MUST** be authorized separately from generic write permission.
2. Approval **MUST** bind to a specific semantic operation and normalized target set.
3. Planned targets **MUST** be an exact subset of approved targets.
4. Wildcards and recursive expressions **MUST** be resolved before approval.
5. Target state **MUST** be revalidated immediately before execution when state drift could change impact.
6. Missing, expired, stale, or malformed approval **MUST** block execution.
7. A model-controllable argument **MUST NOT** disable a mandatory human approval requirement.
8. `stop`, `archive`, `delete`, `reset`, and equivalent lifecycle verbs **MUST NOT** inherit authorization from one another.
9. High-risk actions configured as `human_required` **MUST** receive explicit human approval.
10. The executor **MUST NOT** broaden scope after approval because of shell expansion, discovered files, retries, or inferred intent.
11. Actual mutations **MUST** be logged with operation, exact targets, approval ID, and outcome.
12. The implementing agent **MUST NOT** be the sole verifier of destructive changes.
13. Recovery capability **SHOULD** exist, but **MUST NOT** substitute for prevention.
14. Security controls **MUST NOT** be weakened to reduce approval friction.