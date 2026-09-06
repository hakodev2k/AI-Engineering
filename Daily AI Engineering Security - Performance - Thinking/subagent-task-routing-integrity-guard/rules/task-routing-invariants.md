# Task Routing Invariants

1. Every delegated event MUST carry a machine-readable `run_id`, `parent_task_id`, `worker_task_id`, `destination_task_id`, and event type.
2. The runtime MUST validate those identifiers against canonical spawn/lineage state before accepting the event.
3. A worker MUST NOT send progress or completion state to a historical or unrelated task unless an explicit routing rule authorizes that destination.
4. Human-readable message text MUST NOT be used as authoritative identity or lineage evidence.
5. The parent MUST NOT mark delegated work complete solely because progress text claims completion.
6. Terminal status SHOULD be reconciled against canonical child state before the parent exits.
7. Missing watcher notifications MUST trigger bounded reconciliation rather than indefinite waiting.
8. Reconciliation retries MUST be bounded to 2 attempts per missing terminal event.
9. A destination mismatch MUST block parent-state mutation and MUST emit a quarantine/audit record.
10. Unknown worker identity MUST fail closed for completion, approval, or write-authorizing events.
11. Historical task references MUST be labeled as non-routing context.
12. Implementing agents MUST NOT be the sole verifier of routing-integrity changes.
13. Dangerous recovery actions that mutate unrelated task state MUST require explicit human approval.
