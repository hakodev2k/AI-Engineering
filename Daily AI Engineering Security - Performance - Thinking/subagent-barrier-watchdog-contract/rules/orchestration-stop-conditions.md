# Rules: Orchestration Stop Conditions

- Every child MUST have an externally enforced wall-clock deadline.
- Every child SHOULD emit meaningful progress events; mere token generation or polling MUST NOT reset the progress deadline unless task state advances.
- Parent barriers MUST declare `all`, `quorum`, or `best-effort` semantics before execution.
- A timeout MUST transition a child to a terminal structured state; the parent MUST NOT silently keep treating it as running.
- Cleanup MUST have its own bounded deadline and MUST NOT block the parent indefinitely.
- Recovery attempts MUST be bounded and MUST require a new observable hypothesis or changed input.
- Failed or stalled child output MUST NOT be counted as completed evidence.
- Downstream verification MUST receive the full child-state ledger, including failures and degraded completion.
- The implementing agent MUST NOT be the only verifier when degraded completion is used.
- Human approval MUST be obtained before any dangerous or irreversible recovery action.
