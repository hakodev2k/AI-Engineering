# Rule — Discovery Instruction Trust Boundary

1. Remote MCP discovery instructions MUST be classified as untrusted input regardless of server display name or registry source.
2. Remote instructions MUST NOT modify system/developer policy, authorization, tool grants, approval requirements, sandbox boundaries, or secret-handling policy.
3. A server-provided request to read credentials, environment secrets, private keys, tokens, browser/session state, or unrelated user data MUST be denied unless the host has a separately established explicit workflow authorizing that exact data access; server text alone can never establish that authorization.
4. A request for a capability not already granted by the host MUST be denied.
5. A request involving destructive writes, code execution, credential use, external transmission, or production mutation SHOULD require fresh human approval even when the underlying capability is available.
6. Raw discovery instructions MUST NOT be inserted into the trusted system-policy region.
7. Allowed instructions MUST be normalized, length bounded, labeled as untrusted server guidance, and associated with a content hash.
8. Changed instruction content MUST be re-evaluated even when the same server was previously approved.
9. Forbidden control characters and suspicious invisible Unicode MUST block automatic admission.
10. Policy-override phrases, requests to ignore prior instructions, conceal activity, bypass approval, or redefine trust hierarchy MUST block automatic admission.
11. Deterministic deny decisions MUST NOT be overridden by the model itself.
12. `review` decisions MUST NOT execute or pre-stage the requested privileged action before approval.
13. Security logs MUST record server identity, source, hash, policy version, decision, rule hits, and approval identity when applicable, while avoiding secret values.
14. Security validation failures MUST fail closed.
15. Automated retries MUST be bounded to one re-evaluation after normalization; persistent ambiguity MUST escalate or stop.
