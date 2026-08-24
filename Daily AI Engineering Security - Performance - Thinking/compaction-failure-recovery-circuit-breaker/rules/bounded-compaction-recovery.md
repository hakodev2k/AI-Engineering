# Rules: Bounded Compaction Recovery

1. Compaction recovery MUST have a finite retry budget.
2. A retry MUST NOT occur after repeated failure unless new evidence or a changed recovery strategy exists.
3. Destructive summarization/replacement SHOULD be preceded by durable checkpoint evidence when the runtime supports checkpoints.
4. Failure diagnostics MUST NOT be blindly re-injected into the next summary input when doing so increases prompt pressure without task value.
5. A session end following compaction start/failure MUST NOT be reported as task completion unless task completion evidence exists independently.
6. Provider-native and host context-window/compaction thresholds MUST be measured or explicitly configured; assumptions MUST NOT be treated as verified facts.
7. Meaningful progress MUST be observable: lower prompt pressure, successful compaction, successful model turn, completed checkpoint, or completed task artifact.
8. Activity, repeated tool calls, or repeated summaries MUST NOT count as progress by themselves.
9. When the circuit opens, the host MUST preserve evidence and transition to explicit recovery/escalation rather than continuing autonomously.
10. Recovery MUST NOT weaken security, omit required context, or discard verification criteria merely to fit the window.