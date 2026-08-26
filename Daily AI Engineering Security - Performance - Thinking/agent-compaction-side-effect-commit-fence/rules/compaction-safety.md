# Rules: Compaction Safety
- Context compaction MUST NOT start while a mutating tool action is `issued` or `executing`.
- A mutating action marked `confirmed` MUST have durable evidence independent of the model's narrative.
- An `indeterminate` mutation MUST NOT be treated as success or failure without reconciliation.
- An `indeterminate` mutation MUST NOT be replayed automatically unless idempotency is proven and local policy explicitly permits replay.
- Compaction MUST preserve action IDs, state, idempotency metadata, and confirmation evidence.
- Queued user messages and tool results MUST be included in the boundary snapshot or explicitly carried forward.
- The implementing agent MUST NOT be the only verifier for high-risk state transitions.
- Retry loops MUST be bounded to one automatic state refresh.
- Dangerous or irreversible reconciliation actions MUST require explicit human approval.
