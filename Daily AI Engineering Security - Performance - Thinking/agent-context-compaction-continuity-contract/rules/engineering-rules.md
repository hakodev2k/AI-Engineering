# Engineering Rules

## MUST
- MUST treat compaction as a state-transition boundary requiring explicit capture and resume validation.
- MUST preserve the latest explicit user objective and constraints in structured fields.
- MUST distinguish Facts, Assumptions, Decisions, Failures, and Next Action.
- MUST attach an evidence reference to every fact used to justify continuation decisions.
- MUST record changed files/artifacts and test outcomes that matter to the active task.
- MUST record active external/tool resources by stable ID or handle and status.
- MUST preserve pending human approvals and stop conditions across compaction.
- MUST carry retry counters forward so compaction cannot reset a bounded retry loop.
- MUST validate a checkpoint deterministically before resume.
- MUST stop when required state is missing, contradictory, or cannot be revalidated after the bounded recovery attempt.
- MUST identify checkpoint generation monotonically per task.
- MUST keep checkpoints free of secret values; reference secret names/handles only.
- MUST keep hidden chain-of-thought out of checkpoints; record concise externally communicable rationale only.

## MUST NOT
- MUST NOT infer that a high-level summary implies all operational state survived.
- MUST NOT mark an action/test/file change complete unless observable evidence supports it.
- MUST NOT silently convert unresolved assumptions into facts after compaction.
- MUST NOT reset approvals, retry budgets, safety gates, or destructive-action boundaries during resume.
- MUST NOT re-run an expensive/destructive operation merely because its earlier result disappeared from narrative context; first inspect authoritative state.
- MUST NOT retain credentials, auth headers, tokens, private keys, passwords, or connection-string secrets in checkpoint JSON.
- MUST NOT continue from a checkpoint that fails the configured guard.
- MUST NOT use unlimited reconstruction or retry loops.

## SHOULD
- SHOULD keep the checkpoint compact enough to be re-injected cheaply; prefer IDs and evidence pointers over copied logs.
- SHOULD use authoritative sources (Git state, test result artifacts, task systems, tool/resource registries) to reconcile discrepancies.
- SHOULD checkpoint before known compaction thresholds rather than at the last possible token.
- SHOULD measure post-compaction duplicate work and tool-call overhead.
- SHOULD retain a small lossless operational tail while allowing narrative history to be aggressively summarized.
- SHOULD independently verify high-risk or irreversible actions after resume.

## Observable policy assertions
1. Required-field coverage = 100% before resume.
2. No checkpoint contains configured secret-like keys.
3. Every fact entry has non-empty `statement` and `evidence`.
4. Every active resource has `id` and valid `status`.
5. `state.next_action` is non-empty.
6. Retry counters and stop conditions exist before any bounded loop resumes.
7. Guard exit code is zero before executor handoff.
