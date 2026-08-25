# Skill Materialization Performance Rules

1. Clients **MUST** measure cold-start requests, bytes, and latency before claiming an optimization.
2. Clients **MUST NOT** fetch every skill body/resource merely because it appears in `skills/list`.
3. Clients **MUST** separate catalog discovery from body/resource materialization.
4. Clients **MUST** enforce finite per-task request and byte budgets.
5. Clients **MUST** cap materialization concurrency; unbounded fan-out is prohibited.
6. Clients **MUST** reuse cached resources when the advertised digest is unchanged and policy permits.
7. Clients **MUST NOT** drop a task-required skill solely to satisfy a token/network budget; they must surface budget exhaustion or request policy escalation.
8. Clients **SHOULD** prioritize explicitly requested or high-relevance skills over speculative prefetch.
9. Clients **SHOULD** coalesce duplicate resource URIs/digests across overlapping discovery paths.
10. Clients **MUST** record why each resource was fetched, skipped, or served from cache.
11. Performance claims **MUST** include before/after measurements under the same workload.
12. Optimization **MUST NOT** weaken skill provenance, permissions, integrity checks, or required security review.
