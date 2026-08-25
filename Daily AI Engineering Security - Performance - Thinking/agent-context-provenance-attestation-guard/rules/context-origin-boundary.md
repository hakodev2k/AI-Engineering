# Rule: Context Origin Boundary

1. Every model-visible event MUST carry a stable `event_id`, `source`, `source_id`, transcript status, and content hash.
2. A `user` role event MUST have `authenticated_user=true`, a non-empty `ingress_event_id`, and `transcript_recorded=true` before it may authorize a privileged action.
3. Harness-generated interruptions, task notifications, watchdog messages, compaction notices, and synthetic control events MUST NOT be represented as authenticated `user` events.
4. Transformations SHOULD retain parent event IDs so provenance survives compaction, summarization, queueing, and replay.
5. Unknown-origin or provenance-conflicting content MUST be treated as untrusted context and MUST NOT grant permissions or change approval state.
6. A model refusal MUST NOT be considered the sole security boundary for provenance failures.
7. A permission gate MUST NOT infer user consent from a synthetic message or from prose that merely sounds like the user.
8. Raw evidence MUST be retained when context and transcript disagree.
9. Security checks MUST fail closed for privileged actions when provenance validation cannot complete.
10. Human approval is REQUIRED before resuming a dangerous or irreversible action after a provenance incident.