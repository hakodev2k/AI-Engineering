# Sandbox Root Migration Rules

- Migration MUST start from an explicit source environment, destination environment, and approved destination root set.
- Every `cwd`, workspace root, writable root, sandbox root, permission path, and host-skill path MUST be inventoried before commit.
- Windows↔WSL drive mappings MUST be explicit; ambiguous or Linux-native WSL paths MUST NOT be guessed into Windows paths.
- Mixed-namespace paths such as `C:\\mnt\\d\\...` or `/mnt/c/.../D:\\...` MUST block completion.
- Writable/sandbox roots MUST be equal to or descendants of approved destination roots unless a separately documented system root is explicitly allowed.
- Migration MUST NOT broaden filesystem permissions to recover compatibility.
- Security-relevant state across SQLite, global state, rollout records, and permission profiles MUST converge before execution resumes.
- A backup/rollback point MUST exist before any destructive migration.
- Active agent/runtime writers MUST be stopped before commit.
- Post-migration verification MUST be independent from the component that performed the transformation.
- Failed verification MUST restore or retain the original state and MUST NOT be hidden by disabling sandbox checks.
- A migration retry MUST be bounded to one corrected attempt before human review.