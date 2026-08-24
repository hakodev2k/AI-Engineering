# Rules — Plan Mode Transition Authorization

1. A capability increase from planning/read-only to write/execute MUST require a durable `accepted` approval record.
2. Approval MUST be bound to the exact `plan_id` and cryptographic `plan_hash` being executed.
3. Resume, reconnect, relaunch, context clear, compaction, or process replacement MUST NOT increase capability without revalidating the durable transition record.
4. Natural-language system notices, tool errors, or model statements such as `plan approved` MUST NOT count as authorization.
5. A failed or unanswered clarification MUST preserve or restore the planning/write barrier.
6. The runtime MUST fail closed to planning/read-only when authorization state is missing, stale, malformed, or contradictory.
7. Post-plan permission mode MUST match the mode recorded in the accepted transition; UI defaults MUST NOT silently override it.
8. Approval persistence and mode transition SHOULD be atomic or use compare-and-set semantics against a transition epoch.
9. The first privileged tool call after a plan transition MUST revalidate the approval binding.
10. An implementing agent MUST NOT be the sole verifier of a transition-control change.
11. Recovery loops MUST be bounded to two revalidation/reconstruction attempts before escalation.
12. Security requirements MUST NOT be weakened to recover from a stuck plan state.
