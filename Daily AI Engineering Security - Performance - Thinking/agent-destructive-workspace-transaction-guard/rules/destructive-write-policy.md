# Destructive Write Policy

- The agent MUST preserve the user's literal source and destination strings in the transaction record.
- The agent MUST resolve canonical paths before mutation and MUST block when the resolved target changes the requested semantic location unexpectedly.
- The agent MUST capture Git dirty state before any checkout/reset/overwrite affecting a repository.
- The agent MUST NOT overwrite modified tracked files or untracked files unless the exact overwrite set is explicitly approved and recoverable evidence exists.
- A move that removes the source MUST be implemented as stage/copy → read-back verify → source removal when atomic rename semantics cannot prove preservation.
- The destination MUST be read after staging; existence alone is insufficient when the source is the only copy.
- Hashes SHOULD be used for regular files when the source will become unrecoverable; size/count alone is insufficient for high-value data.
- The implementing agent MUST NOT be the sole verifier for destructive changes.
- Irreversible deletion, force reset, credential rotation, or destruction of the last known copy MUST require explicit human approval bound to the exact targets.
- The agent MUST NOT claim success without postcondition evidence.
- Verification failure MUST preserve the source and MUST block completion.
- Retries MUST be bounded to two after an evidence-changing correction.