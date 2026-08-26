# Research — Checkpoint Side-Effect Reconciliation Gate

**Category:** Thinking  
**Research date:** 2026-08-26 (UTC+7)

## Topic
Prevent stale or compacted agent state from repeating durable external side effects after resume.

## Problem
Long-running AI coding/agent tasks can resume from an older conversational or compacted checkpoint while the filesystem, VCS, deployed service, email provider, billing system, or other external system is already newer. If the agent trusts its reconstructed memory instead of reconciling durable state, it can repeat completed work or duplicate irreversible actions.

## Why it matters now
On August 24, 2026, OpenAI Codex issue #40336 reported a current Windows Desktop build restoring an older conversation checkpoint after app restart/hibernation while a previously completed external action remained durable. July 2026 Codex reports independently describe stale task state resurfacing and context compaction causing completed work to repeat. These reports show a live reliability problem in long-horizon agent workflows.

## Affected users
Developers using coding agents, operators of long-running autonomous workflows, teams using subagents, and platform builders whose agents can write repositories, send messages, deploy, bill, migrate, or mutate remote state.

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #40336 (opened 2026-08-24) reports task restoration from an older conversational checkpoint while newer durable external effects persisted, creating risk of duplicate email, deployment, billing, DNS, migration, or repository operations: https://github.com/openai/codex/issues/40336
2. OpenAI Codex issue #35935 (opened 2026-07-29) reports automatic context compaction losing active execution state and repeating repository reads, commands, builds, and completed subagent work until usage was exhausted: https://github.com/openai/codex/issues/35935
3. OpenAI Codex issue #32863 (opened 2026-07-13) reports obsolete conversation state resurfacing repeatedly in a multi-task workflow after correction, causing duplicated/conflicting work and stale routing: https://github.com/openai/codex/issues/32863
4. LangGraph durable-execution guidance documents that resumes replay work and therefore side-effecting operations must be checkpointed and idempotent; API calls should use idempotency keys or verify existing results before re-execution: https://docs.langchain.com/oss/python/langgraph/functional-api

### Interpretation
The recurring engineering failure is a mismatch between conversational checkpoint state and durable world state. Checkpoint persistence alone is insufficient when side effects can commit outside the checkpoint transaction. Resume must be treated as a verification boundary, not as automatic authority to continue mutating state.

## Existing approaches
- Conversation/context compaction and checkpoint restoration.
- Durable workflow engines that persist task results.
- Idempotency keys for APIs.
- Read-before-write verification or upsert semantics.
- Manual user confirmation after interrupted sessions.

## Remaining limitations
- Many agent tools do not expose idempotency keys.
- Filesystem/VCS state can advance independently of conversational persistence.
- Compacted summaries can preserve goals while losing exact completion state.
- Human reviewers may not know which durable effects already happened.
- A generic resume mechanism may not distinguish read-only continuation from mutation authority.

## Root-cause analysis
1. Agent memory and external side effects are committed in different durability domains.
2. Resume logic often assumes the latest restored conversation is authoritative.
3. Side-effect receipts are not consistently stored as immutable evidence.
4. Mutation tools lack deterministic preconditions tied to expected prior state.
5. Long-running workflows do not always require reconciliation before regaining write authority.

## Improvement opportunity
Introduce a resume-time reconciliation gate. Persist a compact side-effect ledger containing operation id, target, expected pre-state fingerprint, observed post-state fingerprint, receipt/reference and completion timestamp. On resume, compare the restored checkpoint frontier with durable state. If the world is newer, fail closed for mutations until the discrepancy is reconciled. Use idempotency keys when available and deterministic state fingerprints otherwise.

## Relevant sources
- https://github.com/openai/codex/issues/40336
- https://github.com/openai/codex/issues/35935
- https://github.com/openai/codex/issues/32863
- https://docs.langchain.com/oss/python/langgraph/functional-api
