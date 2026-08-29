# Decision Reliability Rules

1. Consequential decisions MUST have an explicit record containing Facts, Assumptions, Evidence, Hypotheses, Decision, Risks, and Verification status.
2. Every critical Fact MUST cite a source identifier and observation timestamp.
3. Mutable critical Facts MUST include a current version, revision, fingerprint, or equivalent freshness evidence when the source supports it.
4. Persistent memory MUST NOT override a higher-authority current source for mutable policy, runtime state, authorization, repository state, or task status.
5. Agent-generated statements MUST NOT be treated as user approval or external evidence.
6. Approval for one task slice MUST NOT be generalized to later slices, scope expansion, destructive operations, or unrelated mutations.
7. After failed/interrupted execution, critical beliefs from the resumed session MUST be revalidated before mutation or completion claims.
8. If a critical source exceeds its freshness budget, the agent MUST refresh it before deciding.
9. If two equally authoritative sources conflict, the agent MUST stop and escalate rather than choose silently.
10. Revalidation loops MUST be bounded by policy; default maximum is two attempts.
11. A decision MUST NOT be marked verified solely because implementation completed or a model states that it is correct.
12. High-impact decisions SHOULD be verified by an agent/reviewer that did not implement the change.
13. Completion claims MUST include evidence that the requested work is actually complete in the current task/repository/runtime state.
14. Missing canonical-source access MUST NOT be papered over by lowering authority thresholds.
15. Failures MUST preserve evidence and state exactly which fact/source prevented a safe decision.
