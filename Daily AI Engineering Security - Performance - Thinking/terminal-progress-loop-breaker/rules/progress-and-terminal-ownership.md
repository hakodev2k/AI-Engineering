# Rules: Progress and Terminal Ownership

- Agent runtimes **MUST** enforce hard turn, token, or wall-clock bounds for autonomous loops.
- Loop detection **MUST** have authority to transition the run to a terminal or checkpoint-and-stop state.
- A blocked tool call **MUST NOT** automatically return control to an unrestricted retry loop after a terminal threshold.
- Tool/event activity **MUST NOT** be counted as progress unless it creates new observable evidence or durable state.
- Equivalent failures **MUST** be compared after removing configured volatile arguments.
- Retry loops **MUST** have bounded thresholds; infinite autonomous retries are forbidden.
- Before terminal stop, the runtime **SHOULD** checkpoint already-created safe artifacts and unresolved-state metadata.
- The implementing agent **MUST NOT** be the only verifier of terminal behavior.
- The package **MUST NOT** request or persist hidden chain-of-thought.
- A false-stop reduction **MUST NOT** be achieved by disabling all terminal enforcement; thresholds must be justified by replay metrics.
