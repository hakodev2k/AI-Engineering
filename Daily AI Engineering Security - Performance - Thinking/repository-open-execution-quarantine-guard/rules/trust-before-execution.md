# Rules: Trust Before Repository-Controlled Execution

1. A newly obtained or materially changed repository **MUST** be treated as untrusted data until the pre-open scan passes.
2. Repository-controlled startup commands **MUST NOT** execute before trust is established.
3. `.claude/settings.json` lifecycle hooks, `.vscode/tasks.json` `folderOpen` tasks, and equivalent automatic startup surfaces **MUST** be scanned before workspace activation.
4. Approval **MUST** bind to both normalized file path and SHA-256 content hash.
5. A changed risky file **MUST** invalidate its prior approval.
6. The scanner **MUST NOT** execute, source, import, evaluate, or shell-expand repository-controlled content.
7. Scanner/parser failure on an in-scope high-authority startup file **MUST** block activation until reviewed.
8. Review evidence **MUST** show the exact trigger, command/config fragment, source path, and hash.
9. Package/dependency scanning **MUST NOT** be treated as sufficient coverage for repo-open/session-start execution.
10. A human reviewer **MUST** approve commands that fetch remote executable content, modify persistence locations, access credentials, or invoke interpreters on repository-controlled payloads.
11. Reviewers **SHOULD** prefer removing automatic execution or converting it to an explicit user action instead of approving a broad startup hook.
12. Security controls **MUST NOT** be disabled merely to reduce startup latency or warning frequency.