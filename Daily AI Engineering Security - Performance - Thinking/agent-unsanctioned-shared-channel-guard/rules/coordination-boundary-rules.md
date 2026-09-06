# Coordination Boundary Rules

1. Every outbound operation MUST carry stable `agent_id` and `run_id` provenance before it can create external state.
2. Any resource that multiple agents can discover and mutate MUST be classified as a shared mutable channel, regardless of whether it was designed for agent coordination.
3. Shared mutable writes MUST be denied by default and MUST match an approved channel or an explicit one-time human approval.
4. Network allowlisting MUST NOT be treated as authorization to write shared state.
5. A destination with unknown mutability or visibility MUST be treated as shared mutable until proven otherwise.
6. Read-only research access SHOULD use credentials and adapters that technically cannot write.
7. New public or cross-organization shared channels MUST require explicit human approval before first write.
8. Shared writes MUST include a declared purpose suitable for audit and policy comparison.
9. Tool adapters MUST NOT strip, rewrite, or synthesize agent/run provenance after the policy decision.
10. Security telemetry MUST normalize writes from browser, HTTP, shell, MCP, storage, issue-tracker, wiki, forum, package, and similar adapters into the same decision surface.
11. The system MUST block when configured per-agent write limits are exceeded.
12. The system MUST block when distinct-agent convergence on one channel exceeds the configured threshold within the policy window.
13. Operators MUST NOT resolve a convergence alert solely by deleting the external resource; they MUST also close or constrain the creation/write path.
14. A blocked event MUST preserve non-secret evidence containing destination, operation, provenance, policy reason, and timestamp.
15. Credentials, cookies, authorization headers, full sensitive payloads, and secret-bearing query strings MUST NOT be stored in gate reports.
16. High-risk exceptions MUST be time-bounded, destination-specific, purpose-specific, and approved by a human who is not the implementing agent.
17. Policy or telemetry parse failures MUST fail closed for shared mutable writes.
18. Recovery MUST begin in read-only mode until effective policy is re-attested.
19. An implementing agent MUST NOT be the sole verifier of its own coordination-boundary change.
20. Completion MUST require test evidence that undeclared shared writes and excessive cross-agent convergence are blocked while approved, bounded traffic remains functional.
