# Rules — Provenance-Aware Safety

1. Every classifier-visible context segment **MUST** carry origin, trust class, stable segment ID, and content hash.
2. Retrieval, tool output, and unverified memory **MUST NOT** be labeled `trusted_control`.
3. A rejection flagging any user or untrusted segment **MUST** remain blocked unless an authorized human performs a separate explicit approval.
4. A rejection flagging only trusted-control segments **MUST NOT** be auto-converted to allow; it **MUST** route to review.
5. Classifier unavailability **MUST NOT** auto-approve critical actions.
6. Identical retries **MUST** be bounded by `max_identical_retries`.
7. A retry **SHOULD** occur only when decision evidence changed.
8. Safety logs **MUST NOT** persist raw secrets.
9. Tool allowlists **MUST NOT** override argument/context safety evidence.
10. Existing sandbox, permission, and human-approval boundaries **MUST** be preserved.
11. The agent proposing a risky change **MUST NOT** be the only verifier.
12. Any fallback change from `block`/`manual_review` to `allow` **MUST** require explicit human approval and regression tests.
