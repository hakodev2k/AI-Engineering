# Rules — Approval Context Integrity

1. A sensitive tool call MUST NOT execute unless the reviewer-visible action is canonically equivalent to the executable action.
2. Sensitive tool arguments MUST NOT be silently defaulted, dropped, or replaced after a parse error.
3. A permission request MUST expose the material command, paths, destination, mutation payload, or equivalent arguments needed to understand side effects.
4. A generic natural-language summary MUST NOT substitute for missing structured arguments on sensitive calls.
5. Approval for one action hash MUST NOT authorize a different action hash.
6. The execution layer MUST revalidate approval binding after approval and before side effects.
7. Tool-call IDs SHOULD be logged with action hashes and verdicts, but logs MUST NOT contain plaintext secrets solely for audit convenience.
8. A client that cannot render sensitive arguments MUST fail closed or route to an alternate reviewer surface that can.
9. Parse status MUST distinguish `absent` from `defaulted` and `error`.
10. Automated reviewers MUST obey the same payload-equivalence requirement as human reviewers.
11. Read-only calls MAY use less strict disclosure only when independently classified as non-mutating and non-secret-bearing.
12. No failure path may downgrade a sensitive call from `block` to `allow` merely to preserve workflow continuity.
