# Rules: Control-Plane Immutability

1. Security-policy files MUST be inventoried before privileged agent execution.
2. Privileged actions MUST NOT run when control-plane attestation is missing, stale, malformed, or reports drift.
3. The governed agent MUST NOT create, replace, edit, chmod, delete, or re-baseline its own protected policy files as part of normal task execution.
4. Baseline creation/update MUST require an explicit human-controlled operation distinct from the agent action being authorized.
5. A baseline SHOULD be stored outside paths writable by the governed agent.
6. Approval of a command MUST NOT implicitly approve a policy mutation.
7. Protected-file appearance, disappearance, symlink retargeting that changes content, or hash change MUST trigger re-review.
8. Runtime hosts SHOULD re-attest after resume, branch/worktree switch, config reload, agent delegation, or process boundary changes.
9. If declared policy and effective runtime behavior disagree, the stricter boundary MUST win and the mismatch MUST be logged for investigation.
10. Security controls MUST NOT be weakened to make attestation pass.