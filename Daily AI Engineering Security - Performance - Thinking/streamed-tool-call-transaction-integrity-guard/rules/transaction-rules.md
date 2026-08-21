# Transaction Integrity Rules

- Raw streamed argument fragments MUST be preserved before normalization or repair.
- A tool call MUST NOT execute until stream assembly is terminal/complete according to provider semantics.
- JSON validity and tool-schema validity MUST be checked separately.
- Malformed or partial arguments MUST NOT be silently replaced with executable `{}`.
- Empty arguments MAY normalize to `{}` only when the stream is complete and the declared schema allows an empty object.
- A call ID reused with different arguments MUST be treated as an integrity conflict and MUST block automatic execution.
- Every side-effecting call MUST track execution state: `not-started`, `started`, `succeeded`, `failed`, or `unknown`.
- A write in `unknown` execution state MUST NOT be retried automatically unless a verified idempotency key makes replay safe.
- Recovery loops MUST be bounded by `config/policy.json`.
- Required acceptance criteria MUST NOT be marked complete while their tool transaction is failed, unknown, or not-started.
- The implementing component MUST NOT be the only verifier for changes that affect write execution or recovery semantics.