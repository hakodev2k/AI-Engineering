# Research — Compaction Governance Pinning Guard

## Topic
Compaction Governance Pinning Guard

## Category
Security

## Problem
Long-horizon agents compact, summarize, truncate, or evict context to stay within model limits. If security constraints, approvals, trust boundaries, or tool restrictions are treated like ordinary conversational content, lossy compaction can remove or weaken them while the agent continues operating with powerful tools.

## Why it matters now
Long-running agent products increasingly depend on aggressive context management. Recent research and production bug reports show that compaction can both alter what survives and fail in unsafe ways. Governance constraints therefore need an integrity path independent of lossy conversational summaries.

## Affected users
Agent-platform developers, coding-agent users, teams with long-running autonomous workflows, security engineers, tool authors, and operators relying on in-context policies or approvals.

## Current public evidence
### Observed evidence
1. The 2026 paper **Governance Decay: How Context Compaction Silently Erases Safety Constraints in Long-Horizon LLM Agents** evaluates 1,323 episodes and reports materially higher policy violation after constraints are omitted by compaction; its proposed constraint pinning prevents this failure in the tested benchmark: https://arxiv.org/abs/2606.22528
2. Anthropic Claude Code issue #40352 reports a compaction race where rate limiting during compaction left thousands of prior message contents empty and no replacement summary, demonstrating that compaction is a state-changing reliability boundary with possible catastrophic information loss: https://github.com/anthropics/claude-code/issues/40352
3. Claude Code issue #84187 (2026-08-05) reports context-compaction thrashing where large attachments refill the context almost immediately after compaction, showing repeated compaction can occur in real agent sessions: https://github.com/anthropics/claude-code/issues/84187
4. OpenClaw issue #118772 (2026-08-03) reports inflated cumulative token accounting triggering compaction at only 4–8% of configured context, showing compaction may occur earlier than expected when usage accounting is wrong: https://github.com/openclaw/openclaw/issues/118772
5. Addressable Recall Compaction (2026-07-27) reports that replacing older observations with stable addressable references can retain information better than lossy baselines in evaluated settings, supporting separation of archive from active presentation: https://arxiv.org/abs/2607.25066

## Existing approaches
- Summarize the entire conversation into a smaller message.
- Truncate oldest history.
- Retrieve older information semantically when needed.
- Keep large prompts/system instructions outside conversational history where supported.
- Re-inject policies after compaction through application code.

## Remaining limitations
A generic summarizer may omit constraints it considers irrelevant. Re-injection logic can drift from the version that governed the original action. Semantic retrieval is not guaranteed to retrieve a policy exactly when needed. A compaction transaction can partially fail. Repeated compaction can amplify summary drift. Most systems do not prove that all active approvals and prohibitions survived compaction unchanged.

## Root-cause analysis
- Governance state and conversational state share the same lossy transformation pipeline.
- Policies are represented as free text without stable IDs, versions, hashes, scope, or expiry.
- Compaction completion is often inferred from a new summary rather than validated as an atomic state transition.
- Security checks may consume the compacted transcript instead of an authoritative policy ledger.
- There is no deterministic post-compaction diff proving that required constraints survived.

## Improvement opportunity
Maintain an authoritative governance ledger outside lossy context. Pin compact policy references into every active context, validate hashes and scope before tool execution, and make compaction a two-phase operation: generate candidate compacted context, verify required governance coverage, then commit. Reject or roll back a compaction candidate that loses active constraints.

## Goal
Prevent context compaction from silently weakening agent security policy, approvals, or trust boundaries.

## Metrics
- 100% active governance constraints have stable ID/version/hash.
- 100% post-compaction contexts reference every active required constraint.
- 0 security-tool decisions are made solely from lossy summary text.
- 0 compaction commits succeed when governance validation fails.
- Adversarial omission fixtures produce 0 unauthorized tool actions.

## Trigger
Automatic/manual compaction, summary replacement, history truncation, context eviction, session resume from compacted state, or any tool call after a compaction boundary.

## Inputs
Authoritative governance ledger, active context, candidate compacted context, constraint scopes, hashes, approvals, expiry/revocation state, requested tool action.

## Outputs
Validated compaction candidate, coverage report, missing/mismatched constraints, commit/rollback decision, action-time governance decision, and audit evidence.

## Interpretation
The production bug reports demonstrate compaction fragility; the research demonstrates a security consequence when governance content is lost. This package treats the combination as a general engineering risk, not proof that every current agent product is exploitable.

## Proposed solution
A reusable governance-pinning procedure, deterministic constraint validator, two-phase compaction workflow, independent verifier, and action-time rule requiring authoritative policy lookup rather than trusting a lossy summary.

## Relevant sources
- https://arxiv.org/abs/2606.22528
- https://github.com/anthropics/claude-code/issues/40352
- https://github.com/anthropics/claude-code/issues/84187
- https://github.com/openclaw/openclaw/issues/118772
- https://arxiv.org/abs/2607.25066
