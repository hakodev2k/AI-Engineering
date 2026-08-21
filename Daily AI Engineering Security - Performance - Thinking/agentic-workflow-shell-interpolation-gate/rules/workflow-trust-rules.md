# Workflow Trust Rules

## Scope
These rules apply to GitHub Actions workflows and composite actions that consume repository/event content or invoke AI agents.

## Enforceable rules
- Untrusted `github.event.*`, `github.head_ref`, branch, issue, comment, and pull-request values **MUST NOT** be directly interpolated into shell `run:` blocks.
- Untrusted values needed by a shell step **MUST** be passed through `env:` or an action input and consumed as quoted data rather than generated shell source.
- Agentic workflows **MUST** declare explicit least-privilege `permissions:`; implicit defaults are not acceptable.
- Workflows triggered by `pull_request_target` **MUST NOT** checkout or execute attacker-controlled head code with privileged credentials.
- Repository instruction files from an untrusted PR/head branch **MUST** be treated as untrusted content, not control-plane policy.
- Wildcard external-user authorization for command-capable agents **MUST NOT** be enabled without an explicit reviewed threat model and budget/permission constraints.
- Self-hosted runners **MUST NOT** execute untrusted fork code unless a separately isolated ephemeral runner boundary is proven.
- Secrets **MUST NOT** be made available to jobs whose behavior is influenced by unauthenticated or untrusted event content unless a human approval gate occurs before secret access.
- High-confidence scanner findings **MUST** block completion until fixed or covered by a documented, reviewed exception.
- Exceptions **MUST** identify the file, line/pattern, owner, reason, compensating control, and expiry/review date.
- Security review **SHOULD** consider both model prompt injection and deterministic workflow/shell injection; passing one layer does not imply the other is safe.

## Verification
A change passes only when `scripts/scan_github_actions.py` exits 0, declared permissions are reviewed, and any medium-confidence findings have an explicit reviewer decision.

## Stop conditions
Stop automated remediation after two unsuccessful attempts to remove the same blocking finding. Escalate to a human reviewer rather than weakening permissions or suppressing the finding generically.
