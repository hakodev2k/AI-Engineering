# Rules: Cache-Safe Optimization

- A baseline MUST be captured before claiming a cache improvement.
- Cache performance MUST be measured from provider usage fields when available; estimates MUST be labeled estimates.
- Required security, policy, tool, and task context MUST NOT be removed solely to increase cache hits.
- Content MUST NOT be reordered unless its application contract proves order is semantically irrelevant.
- Tool schemas and stable instructions SHOULD be deterministically serialized when semantics permit.
- Dynamic data such as timestamps, request IDs, changing repository dumps, and user-specific text SHOULD be placed after reusable stable prefixes when correctness permits.
- Candidate changes MUST pass the existing task-quality/evaluation gate before completion.
- A lower latency or token count MUST NOT be called an improvement when quality regresses.
- Cache-write tokens SHOULD be included in cost analysis on models that report/bill them.
- Provider-specific cache behavior MUST be verified empirically and MUST NOT be assumed from prefix hashes alone.
- Optimization loops MUST stop after two failed hypotheses unless new evidence identifies a distinct cause.
- Traces MUST NOT contain credentials, bearer tokens, private keys, or unredacted secrets.
