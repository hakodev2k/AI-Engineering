# Rules: MCP stdio Command Boundary
- MCP stdio launches MUST use structured `executable` and `argv`; a shell command string MUST NOT be accepted.
- Authorization MUST cover both executable and arguments.
- Policy MUST bind an invocation contract to a specific `server_id`.
- Shell/interpreter execution flags such as `-c`, `--command`, `-e`, `--eval`, and `/c` MUST be blocked unless a separately reviewed policy explicitly models them; this package intentionally does not.
- Shell metacharacters in arguments MUST block completion when shell interpretation could occur.
- Unknown servers and malformed argv MUST fail closed.
- The guard MUST run before process creation.
- Secrets MUST NOT be included in policy logs or regression fixtures.
- Human approval SHOULD display the normalized executable and every argument.
