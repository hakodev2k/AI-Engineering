# Rules: Hook Write Authorization

- Executable hook/custom-agent configuration MUST be treated as code, not ordinary text.
- An agent MUST NOT create or modify executable hook configuration without explicit approval scoped to that file change.
- Approval for a generic edit tool MUST NOT be interpreted as approval for deferred command execution.
- Hook commands MUST remain inside the approved workspace unless an explicit exception is reviewed.
- Parent traversal and unsafe bootstrap patterns such as pipe-to-shell MUST be blocked.
- Malformed hook configuration MUST fail closed.
- Hook commands MUST NOT contain hard-coded secrets.
- Security-sensitive hook changes MUST be independently verified by someone or something other than the implementing agent.
- Validation outcomes SHOULD emit stable, secret-free reason codes.
- Teams SHOULD disable hooks when they cannot enforce these controls.
