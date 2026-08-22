# Engineering Rules

## MUST

1. **MUST calculate context budget per active model/agent.** A subagent cannot inherit the coordinator's window unless both resolve to the same effective limit.
2. **MUST reserve recovery headroom.** The runtime must keep enough unused context to create/validate a checkpoint before the hard limit.
3. **MUST checkpoint before platform compaction** when the checkpoint threshold is reached or a major milestone completes.
4. **MUST preserve task-critical operational state**: goal, constraints, facts, unresolved assumptions, decisions, changed files, commands/tests, artifacts, blockers, next actions, verification status.
5. **MUST externalize large durable tool results** rather than relying on them remaining in transcript history.
6. **MUST hash externalized artifacts** when the storage medium allows deterministic bytes.
7. **MUST validate a checkpoint before old context is intentionally evicted or compacted.**
8. **MUST distinguish facts from assumptions.** Assumptions requiring verification may not be promoted to facts during checkpoint creation.
9. **MUST distinguish implementation from verification.** A changed file or completed command is not proof that the task is correct.
10. **MUST preserve negative operational knowledge** that prevents repeated work: failed approaches, rejected hypotheses, known bad commands/configurations, and unresolved blockers.
11. **MUST keep retry counts bounded.** Standard compaction may retry at most once by default before recovery mode.
12. **MUST stop normal continuation at the hard-stop threshold.**
13. **MUST validate resume integrity** before sensitive, destructive, or expensive operations.
14. **MUST keep prompts/instructions functionally stable across resume** unless an intentional change is recorded as a decision.
15. **MUST record checkpoint version and creation timestamp.**
16. **MUST redact or reject secrets before durable checkpoint/artifact persistence.**

## MUST NOT

1. **MUST NOT wait for 100% context utilization** to begin checkpointing.
2. **MUST NOT treat prompt cache as durable state.** Cache loss must not make the task unrecoverable.
3. **MUST NOT store hidden chain-of-thought.** Checkpoints contain observable state, decisions, short rationale, evidence, and next actions only.
4. **MUST NOT summarize away unresolved blockers or failed tests.**
5. **MUST NOT silently drop large tool outputs that are required for later verification.**
6. **MUST NOT assume a free-form summary is complete without validation against required fields.**
7. **MUST NOT compact after checkpoint validation fails.**
8. **MUST NOT continue after an artifact hash mismatch** until the discrepancy is resolved or explicitly accepted by a human.
9. **MUST NOT use unlimited compaction/recovery loops.**
10. **MUST NOT replay the entire history by default** when a verified checkpoint and targeted artifacts are sufficient.
11. **MUST NOT mark an assumption as verified solely because it survived compaction.**
12. **MUST NOT copy binary/base64 payloads into checkpoints.**
13. **MUST NOT use global context thresholds for mixed-model multi-agent systems.**
14. **MUST NOT overwrite a previously verified checkpoint until the replacement validates.**

## SHOULD

1. **SHOULD checkpoint at phase boundaries** even when token usage is still low if later reconstruction would be expensive.
2. **SHOULD keep a short operational tail** after the checkpoint containing the most recent commands, errors, edits, and immediate next step.
3. **SHOULD externalize source-of-truth artifacts** such as build logs, test reports, patches, benchmark results, database explain plans, and large tool responses.
4. **SHOULD include stable repository references** such as commit SHA, branch, file path, and line range when useful.
5. **SHOULD track estimated token savings** between full-history replay and checkpoint-based resume.
6. **SHOULD run recovery drills** with synthetic long tasks to verify that checkpoints are actually sufficient.
7. **SHOULD compact after milestones, not every turn.**
8. **SHOULD prioritize correctness over maximum token reduction.** If a field is required for safe continuation, retain it.
9. **SHOULD version checkpoint schema migrations** and keep backward-compatible readers for recent versions.
10. **SHOULD emit metrics** for checkpoint size, context ratio, reserve size, validation failures, compaction failures, resume failures, and full-history fallbacks.

## Observable enforcement examples

| Rule | Observable check |
|---|---|
| Per-model budget | Log contains active model + resolved limit for each agent |
| Recovery reserve | Pre-compaction metric shows remaining tokens >= configured reserve |
| Durable tool state | Large durable tool output has artifact URI/path + SHA-256 |
| Checkpoint validity | Validator exits 0 before compaction hook runs |
| Bounded retry | Attempt counter never exceeds policy maximum |
| Resume integrity | Sensitive tool gate requires `resume-ok` state |
| No secret persistence | Secret scanner/redaction hook passes before checkpoint commit |