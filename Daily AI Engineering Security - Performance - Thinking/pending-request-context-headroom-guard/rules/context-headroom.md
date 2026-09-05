# Context Headroom Rules

1. Every model call **MUST** evaluate the projected complete next request, not only the previous completed request.
2. Projection **MUST** include current history, pending user input, pending tool/retrieval/file content, static instructions, and memory injected for the next call.
3. Admission **MUST** reserve configured output tokens and tokenizer/model uncertainty headroom.
4. The effective context-window value **MUST** have an identifiable runtime or provider source; unknown capacity **MUST NOT** be guessed for automatic admission.
5. A request whose projection exceeds the hard usable capacity **MUST NOT** be sent unchanged.
6. A context-overflow response **MUST NOT** be blindly retried with the same or larger context.
7. Compaction **MUST NOT** remove security controls, user constraints, active acceptance criteria, unresolved decisions, or evidence explicitly marked as protected.
8. Compaction attempts **MUST** be bounded to two per request before escalation or a different explicit strategy.
9. Before/after token measurements **MUST** be recorded for any optimization claim.
10. Token savings **MUST NOT** be reported as successful when task quality, verification coverage, or required-context retention regresses beyond the configured tolerance.
11. Projected-versus-actual token error **SHOULD** be monitored and used to tune the uncertainty margin.
12. Deterministic admission logic **SHOULD** run as a pre-send hook rather than relying on model instructions.