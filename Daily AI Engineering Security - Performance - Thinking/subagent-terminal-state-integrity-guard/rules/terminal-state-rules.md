# Terminal-State Rules

1. A parent workflow **MUST NOT** treat `completed`, `success`, exit code 0, or an equivalent transport status as sufficient proof that delegated work is complete.
2. Every accepted child run **MUST** satisfy its declared deliverable contract.
3. Every emitted tool call that requires a result **MUST** have a correlated terminal result before the child is accepted, unless the contract explicitly declares that tool call fire-and-forget and proves it has no required result.
4. A terminal reason containing `tool_deferred`, `limit`, `cancel`, `interrupt`, `timeout`, `error`, or an unknown/non-natural stop **MUST** block automatic acceptance.
5. Required artifacts **MUST** exist, meet configured minimum-size/content rules, and pass configured verification commands before acceptance.
6. A child result that is empty, only a preamble, or missing required structured fields **MUST** be classified `incomplete` rather than `accepted`.
7. The parent **MUST NOT** silently convert `incomplete` into success by inferring what the child probably intended.
8. Recovery **MUST** be bounded. The default maximum is two recovery attempts for the same logical task.
9. A retry that may repeat an external side effect **MUST NOT** execute until idempotency or prior-side-effect state is established.
10. Partial outputs and transcripts **SHOULD** be reused when trustworthy rather than discarded and recomputed.
11. High-impact conclusions based on delegated work **MUST** receive independent verification after recovery.
12. The implementation **MUST** preserve the original terminal reason and validation evidence in the audit record.
13. Verification rules **MUST NOT** be weakened merely to make a failing child appear successful.
14. Unknown schema fields **SHOULD** be retained for audit; unknown terminal states **MUST** fail closed to `needs_review`, not `accepted`.