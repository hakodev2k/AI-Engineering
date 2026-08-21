# Worktree Isolation Rules

- Every agent with repository write capability MUST receive a trusted expected worktree root.
- The expected root MUST NOT be inferred solely from current CWD or model-generated text.
- Before a repository mutation, the agent MUST verify canonical Git top-level, CWD, registered worktree membership, and intended write paths.
- HEAD SHA MUST NOT be used as the sole checkout identity proof.
- When an expected branch is configured, the current branch MUST match it exactly.
- Every intended write path MUST resolve beneath the expected root.
- A root, branch, registration, CWD, or path mismatch MUST block the operation.
- Identity MUST be reverified after handoff, resume, `EnterWorktree`, branch switch, or shell/session replacement.
- A successful boundary check MUST NOT be treated as authorization for destructive Git operations.
- Destructive or irreversible repository actions MUST retain their separate human-approval requirement.
- The guard MUST NOT weaken OS sandboxing, filesystem permissions, secrets policy, or repository protections.
- Verification commands MUST be read-only.
- Automatic mismatch recovery MUST be limited to one orchestration reassignment/re-resolution attempt; repeated mismatch MUST stop and escalate.