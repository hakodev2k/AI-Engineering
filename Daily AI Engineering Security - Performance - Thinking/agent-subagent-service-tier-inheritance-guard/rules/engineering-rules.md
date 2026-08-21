# Engineering Rules

## MUST

1. **MUST capture a trusted parent service-tier baseline before spawning descendants.** A UI badge alone is insufficient when runtime telemetry is available.
2. **MUST assign every child an expected maximum tier before it performs substantive work.** Unknown is a state, not permission.
3. **MUST compare normalized tier rank, not string equality.** Equivalent aliases such as `default`/`standard` may share a rank.
4. **MUST require an explicit, bounded approval for a child whose observed/requested tier ranks above its allowed parent ceiling.** Approval must identify an actor and reason and must not outlive its intended scope.
5. **MUST re-attest effective tier after resume, fork, or any operation that can reload execution configuration.**
6. **MUST fail closed when policy requires a known child tier and the runtime cannot provide one.**
7. **MUST record parent-child correlation metadata independently of model prose.**
8. **MUST use per-thread positive token deltas rather than naively summing cumulative counters.** Repeated snapshots must contribute zero fresh usage.
9. **MUST treat counter resets as a new measurement epoch, never as negative usage.**
10. **MUST label configured tier multipliers as estimates unless authoritative provider billing data confirms them.**
11. **MUST enforce descendant-count and lineage-depth budgets before spawn.**
12. **MUST preserve a child-tier violation as evidence; do not rewrite or delete telemetry to make the lineage appear compliant.**
13. **MUST separate `Implemented`, `Measured`, and `Verified` status.** A guard being installed does not prove a production lineage was compliant.
14. **MUST use an independent verifier for any incident involving unexpected premium-tier execution.**
15. **MUST stop additional premium-capable delegation when the guard/auditor itself is unavailable or its required input state is inconsistent.**

## MUST NOT

1. **MUST NOT assume descendants inherit the parent's tier merely because no explicit override was requested.**
2. **MUST NOT interpret a missing child tier as Standard/default for enforcement.**
3. **MUST NOT let a subagent approve its own tier escalation.**
4. **MUST NOT create blanket, unbounded premium approvals for future descendants.**
5. **MUST NOT use aggregate weekly-quota movement alone to attribute cost to a particular child or tier.**
6. **MUST NOT double-count copied parent-history telemetry in forked child rollouts.**
7. **MUST NOT claim a configured `priority` multiplier equals authoritative billed credits unless current provider documentation/ledger supports that mapping.**
8. **MUST NOT disable token/accounting verification merely to allow a workflow to finish.**
9. **MUST NOT expose raw prompts, credentials, private paths, or unrelated session content in audit reports when metadata is sufficient.**
10. **MUST NOT retry a tier mismatch indefinitely.** Re-attestation retries are bounded to two attempts; persistent mismatch requires suspension/escalation.

## SHOULD

1. **SHOULD default child tier to the cheapest tier that satisfies the task unless a higher tier is explicitly justified.**
2. **SHOULD expose parent/child/tier/token attribution in task diagnostics before aggregate quota becomes material.**
3. **SHOULD warn when descendants exceed 25% of a configured task token/credit budget, and stop or require approval at the hard ceiling.**
4. **SHOULD keep approvals narrow: one child or one named task, one target tier, one bounded time window.**
5. **SHOULD maintain tier mappings and multipliers in configuration, because provider semantics and pricing can change.**
6. **SHOULD verify lineage policy with synthetic fixtures in CI after any agent-runtime upgrade.**
7. **SHOULD record runtime/client version in verification evidence to help identify regressions.**
8. **SHOULD prefer event-driven usage/tier telemetry over repeated model-mediated polling.**
9. **SHOULD keep audit output machine-readable and stable enough for CI gates.**
10. **SHOULD continue safe work in the parent when child delegation is blocked, rather than weakening the policy.**

## Observable invariants

A compliant task must satisfy these testable invariants:

- `child.expected_rank >= child.observed_rank`, unless a valid approval exists.
- Every child has exactly one intended parent edge in the task lineage.
- Every child attestation occurs before or at the first premium-capable execution boundary.
- Unknown tiers are zero when `unknown_tier_action = fail` at Definition of Done.
- Descendant count and maximum lineage depth stay within policy.
- Repeated cumulative token snapshots do not increase attributed usage.
- Every premium-tier row includes an approval reference or is a recorded violation.
- Final reports never label estimated credits as authoritative billing.
