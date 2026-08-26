# Rules: Progress Control

- A long-running agent MUST have a hard step, time, token, or cost ceiling.
- Liveness MUST NOT be treated as evidence of task progress.
- Progress decisions MUST use observable artifacts, tool results, verification results, or external-state changes.
- Repeated equivalent actions with unchanged evidence MUST trigger a bounded no-progress policy.
- Legitimate polling SHOULD remain allowed when the observed result or external state changes.
- A stop decision MUST record a machine-readable reason.
- Partial durable work MUST be checkpointed before a non-emergency stop when configured.
- Recovery loops MUST have a maximum of two attempts unless a stricter application policy applies.
- The implementing agent MUST NOT be the sole verifier of a recovered run.
- A failed verification MUST NOT be hidden by increasing the budget or weakening acceptance criteria.
