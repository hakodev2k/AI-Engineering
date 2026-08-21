# Rules: Compaction State Integrity

1. The system **MUST** snapshot critical task state before compaction.
2. Critical state **MUST** include task identity, active goal, constraints, completed items, pending items, approval state, verification requirements, and language when language continuity matters.
3. Compaction output **MUST NOT** be accepted solely because it is shorter or semantically similar in free-form text.
4. The system **MUST** run a deterministic invariant check before the compacted state becomes authoritative.
5. A compaction summary **MUST NOT** fabricate a user request, approval, completion event, tool result, or verification result.
6. Completed work **MUST NOT** return to pending state without a durable event explaining the transition.
7. Pending work **MUST NOT** disappear unless it is completed, cancelled, superseded, or explicitly removed with evidence.
8. Approval state **MUST NOT** change without an approval/revocation event bound to the relevant action.
9. Task identity and immutable policy fields **MUST NOT** change across compaction.
10. A previous compaction summary **MUST NOT** be treated as independent evidence when validating a later summary.
11. Static project instructions **SHOULD** be reloaded from their authoritative source after compaction rather than frozen indefinitely inside a recursive summary.
12. Every summary-derived claim **SHOULD** retain provenance to a durable message, tool result, event, or authoritative file when feasible.
13. Failed verification **MUST** block autonomous continuation for critical-state conflicts.
14. Recovery **MUST** use the last verified pre-compaction state and **MUST NOT** recursively compact a known-failed summary.
15. Recovery retries **MUST** be bounded by `config/integrity-policy.json`.
16. The implementing agent **MUST NOT** be the sole verifier when a compaction failure affects approvals, destructive actions, release state, or production changes.