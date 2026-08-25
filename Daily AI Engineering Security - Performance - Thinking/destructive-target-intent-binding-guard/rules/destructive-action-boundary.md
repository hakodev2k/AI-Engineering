# Destructive Action Boundary Rules

1. A destructive filesystem action **MUST** be checked before execution.
2. The checker **MUST** receive an explicit target manifest derived from the user-approved task scope; the proposed shell command is not itself authorization.
3. Every destructive target **MUST** canonicalize inside an allowed root and **MUST** match an explicitly authorized target.
4. Destructive target expressions containing globs, unresolved environment variables, command substitution, drive/filesystem roots, or parent traversal **MUST NOT** execute through the shell path.
5. Recursive deletion **MUST** be treated as `review` unless the host has separately enumerated the exact descendants and a human or higher-assurance policy explicitly approves that set.
6. `git clean` **MUST** be treated as `review`; agents **MUST NOT** substitute it for a narrower requested deletion without re-authorization.
7. An approval **MUST** be invalidated when the command, normalized targets, repository/workspace identity, or target manifest changes.
8. A subagent **MUST NOT** inherit destructive authorization merely because its parent had write/full-access permission.
9. The preflight **MUST NOT** execute, expand, source, or evaluate repository-controlled shell content.
10. The host **SHOULD** prefer recoverable deletion APIs or trash/recycle mechanisms when practical.
11. Failure to parse a potentially destructive command **MUST** fail closed as `review` or `block`.
12. Production bypasses **MUST** require explicit human approval and **MUST** be logged with command hash, target hash, actor, reason, and timestamp.
