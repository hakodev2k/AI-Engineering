# Sandbox Policy Rules

- The host **MUST** treat configured protected paths as logical path prefixes independent of current filesystem existence.
- The host **MUST NOT** authorize a create/write/delete/rename target merely because the protected descendant does not yet exist.
- The host **MUST** canonicalize the workspace and target and reject targets outside the workspace unless separately authorized.
- The host **MUST** block mutations to a protected path and every descendant.
- The host **MUST** evaluate both source and destination for rename/move operations.
- The host **MUST NOT** create `.git`, `.codex`, `.agents`, or other configured sentinels merely to make a deny rule attachable.
- The host **MUST** preserve native sandbox/ACL controls; this guard is defense in depth, not a replacement.
- Effective policy **MUST** be tested for both absent and present protected paths.
- A policy parse/canonicalization failure **MUST** fail closed for mutations.
- Audit output **MUST** include operation, canonical target, matched rule, and decision; it **MUST NOT** include file contents or secrets.
- Human approval **SHOULD** be required to modify the protected-path policy itself, outside the agent execution boundary.
