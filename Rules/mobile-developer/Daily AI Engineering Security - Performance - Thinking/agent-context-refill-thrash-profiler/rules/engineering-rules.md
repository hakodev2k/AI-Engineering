# Engineering Rules

## MUST
- MUST capture a baseline before changing compaction, injection or retrieval behavior.
- MUST attribute context contributions by source and token count.
- MUST fingerprint unchanged static payloads so duplicate re-injection is measurable.
- MUST retain durable references for required tool/file artifacts before removing verbatim content.
- MUST pin security constraints, explicit user requirements, approval state and active task invariants across compaction.
- MUST bound recovery and optimization loops.
- MUST verify token improvement and task quality independently.
- MUST fail the gate when required recoverable state has no `artifact_id` if policy requires references.
- MUST record compaction turns and post-compact refill for at least the configured observation window.

## MUST NOT
- MUST NOT treat lower token count alone as success.
- MUST NOT silently discard required context.
- MUST NOT summarize secrets into persistent context merely to save tokens.
- MUST NOT weaken sandbox, permission, approval or repository-protection rules to reduce context size.
- MUST NOT repeatedly compact when the rolling compaction threshold is already violated.
- MUST NOT blame tool/file payloads without source-level measurement.
- MUST NOT use unlimited retries or unlimited recovery attempts.

## SHOULD
- SHOULD reference byte-identical static instructions by stable digest when the host can deterministically rehydrate them.
- SHOULD load large instruction domains hierarchically and only when task relevance requires them.
- SHOULD keep compact summaries structured as Facts, Active constraints, Decisions, Open work, Risks, Artifact references.
- SHOULD separate static/project context from dynamic execution history in telemetry.
- SHOULD report `other` attribution explicitly and drive it toward zero.
- SHOULD use a fixed verification suite to detect quality regressions.
