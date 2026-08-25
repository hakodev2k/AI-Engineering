# Executable Configuration Policy

- Agent-originated writes to configuration that can register commands, hooks, tools, tasks, workflows, or lifecycle behavior **MUST** be treated as privileged changes even when the path is inside an already trusted workspace.
- Auto-edit or blanket file-write permission **MUST NOT** imply permission to create or modify executable configuration.
- A privileged configuration change **MUST** be approved against the SHA-256 digest of the complete proposed content; an approval for older content **MUST NOT** carry forward after any byte changes.
- A privileged configuration write **MUST** be blocked when `scripts/config_guard.py` exits with code 10.
- The guard **MUST NOT** execute, source, import, or otherwise evaluate repository-controlled configuration while classifying it.
- The implementing agent **MUST NOT** be the only verifier for a privileged configuration change.
- A workflow **MUST** preserve the original trust boundary: no disabling prompts, sandboxing, path checks, or secret controls to make the change easier.
- Human approval **MUST** be required before enabling a newly introduced shell/lifecycle hook or other irreversible/high-impact action.
- Hosts **SHOULD** run this gate before writing and again immediately before the configuration is consumed.
- Audit records **SHOULD** include target path, digest, indicators, approving identity/channel, and verification result without secret values.
