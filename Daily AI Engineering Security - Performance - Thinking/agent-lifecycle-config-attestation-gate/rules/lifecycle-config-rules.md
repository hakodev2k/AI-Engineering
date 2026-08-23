# Lifecycle Config Rules

- A privileged actor **MUST** have a post-transition effective-config attestation before write/network/deploy/secret/high-risk MCP work.
- The observed snapshot **MUST** originate from effective runtime state and **MUST NOT** be a reread of the same declarative file used as the expected contract.
- Actor ID, project root, lifecycle operation, declared hash, and observed hash **MUST** be recorded with the decision.
- Every configured protected path **MUST** exist in both snapshots.
- Protected values **MUST** compare equal under deterministic canonicalization unless a stricter, explicitly implemented comparator is used.
- A missing protected value **MUST NOT** be interpreted as inheritance or a safe default by this gate.
- A protected mismatch **MUST** block privileged work.
- A child/subagent **MUST NOT** approve its own mismatch or change the expected contract.
- A mismatch **MAY** be retried once only after a fresh snapshot if a lifecycle race is plausible.
- The gate **MUST NOT** execute repository-controlled commands to gather evidence.
- Audit output **MUST NOT** include secrets or bearer credentials.
- Teams **SHOULD** maintain controlled canaries for spawn, resume, fork, and nested-root transitions they rely on.