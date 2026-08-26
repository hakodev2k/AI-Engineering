# Rules: Verification Evidence

- A completion claim that says verified or tests passed MUST reference executable evidence.
- Each executed verification MUST receive a monotonically increasing verification epoch.
- Each passing result MUST be bound to the exact verified snapshot identifier.
- A result MUST be considered stale when the current snapshot differs from the verified snapshot.
- Historical committed edits MUST NOT be treated as current unverified worktree changes.
- Temporary harness deletion MUST NOT invalidate an otherwise durable passing result when the code snapshot is unchanged.
- Reverification loops MUST have a maximum of two retries unless a human explicitly authorizes more.
- The implementing agent MUST NOT be the only verifier for high-impact changes.
- Verification evidence SHOULD record command identity, exit code, timestamp, snapshot, and relevant scope.
- Security or correctness checks MUST NOT be weakened merely to clear a stale flag.
