# Rules — Execution-Sensitive Write Boundary

- Agent file-write requests MUST be evaluated against a canonicalized absolute path before execution.
- The runtime MUST resolve symlinked parent directories before policy evaluation.
- Writes outside the approved workspace MUST be blocked unless an explicit, separately reviewed policy allows them.
- Writes to execution-sensitive paths MUST require explicit human approval.
- A model response MUST NOT be treated as authorization for a sensitive write.
- Prompt-injection detection MUST NOT replace deterministic path authorization.
- The agent MUST NOT modify the policy file that governs its own write permissions during the same autonomous run.
- Security decisions MUST be logged with path, decision, and reason codes, but MUST NOT include secrets or file contents unless separately required.
- Sensitive-path policy SHOULD include IDE tasks/settings, MCP registration, CI workflows, Git hooks, shell startup files, credential locations, and agent policy/configuration.
- Implementing agents MUST NOT be the only verifier for changes to the guard or sensitive-path policy.
