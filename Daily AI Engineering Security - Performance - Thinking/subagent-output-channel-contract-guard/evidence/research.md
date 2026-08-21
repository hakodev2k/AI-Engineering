# Research — Subagent Output Channel Contract Guard

## Topic
Subagent Output Channel Contract Guard

## Category
Thinking

## Problem
Multi-agent systems can silently lose a subagent's work when caller-defined output requirements conflict with host-injected tools or output-channel instructions. A child may complete successfully yet return an empty/ambiguous payload, use a structured tool unavailable to the parent, or fail to satisfy a schema that the orchestrator treats as mandatory.

## Why it matters now
Recent Claude Code reports show multiple variants of this failure: an injected `ReportFindings` tool overriding a caller's final-text contract, `/code-review` asking a background agent to use a tool it does not actually have, and schema-bound fan-out workflows aborting when one child fails to emit StructuredOutput. These are observable orchestration-contract failures rather than hidden reasoning problems.

## Affected users
Agent-framework developers, teams using custom subagents, code-review/research orchestrators, CI/headless workflows, and callers relying on typed child results.

## Current public evidence
### Observed evidence
1. Claude Code issue #86998 (opened 2026-08-15) reports `ReportFindings` instructions overriding a caller-defined final-text contract; the parent can receive `[]` after minutes of real investigation, making silent data loss indistinguishable from a clean review: https://github.com/anthropics/claude-code/issues/86998
2. Claude Code issue #84093 (opened 2026-08-05) reports `/code-review` instructing a background agent to call `ReportFindings` while that agent sometimes lacks the tool: https://github.com/anthropics/claude-code/issues/84093
3. Claude Code issue #65500 (opened 2026-06-04) reports a deep-research workflow aborting after large token spend when a schema-bound subagent finishes without calling StructuredOutput, despite automatic nudges: https://github.com/anthropics/claude-code/issues/65500
4. Claude Code issue #83516 (opened 2026-08-03) documents output format changing with review effort and recommends keeping structured payloads in addition to human-readable output rather than replacing it: https://github.com/anthropics/claude-code/issues/83516

## Existing approaches
- Put output-format instructions in the child prompt.
- Inject structured-output/reporting tools into selected agents.
- Retry/nudge children that fail a schema.
- Interpret empty arrays as valid no-findings results.

## Remaining limitations
Natural-language precedence between caller and host tool descriptions can be ambiguous. Tool availability can differ by agent type or resume path. An empty payload may be syntactically valid but semantically ambiguous. Schema retries can multiply cost without addressing an unavailable/contradictory channel.

## Root-cause analysis
- No explicit negotiated contract identifying the authoritative result channel before dispatch.
- Caller instructions and host-injected tool descriptions can impose competing completion rules.
- Orchestrators may validate shape but not provenance/completeness of the child result.
- Tool availability is assumed rather than attested at dispatch time.
- Empty results lack evidence distinguishing “verified empty” from “result channel failed.”
- Retries repeat the same impossible contract instead of re-negotiating.

## Improvement opportunity
Negotiate a machine-checkable output contract before spawning a child. Bind accepted channels, schema, required tools, empty-result semantics, evidence fields, and fallback channel into a contract ID. Preflight tool availability and reject contradictory contracts. At completion, validate that the delivered result came through an accepted channel and contains explicit completion evidence. Retry at most once after contract repair; otherwise fail visibly.

## Goal
Make subagent result delivery deterministic enough that a parent can distinguish verified empty results, partial work, contract failures, and successful typed output.

## Metrics
- output-contract preflight coverage
- result-channel mismatch rate
- ambiguous-empty-result rate
- schema retry count/task
- usable child-result rate
- wasted child tokens on invalid contracts
- verification coverage

## Trigger
Subagent dispatch requiring structured/typed output, injected reporting tools, custom final-message formats, resume/replay, or fan-out workflows whose parent depends on child results.

## Inputs
Caller contract, child agent type, available tools, schema, accepted result channels, empty-result semantics, fallback channel, retry budget.

## Outputs
Contract attestation, dispatch decision, validated result envelope, explicit failure reason, and audit evidence.

## Interpretation
The evidence does not imply structured-output tools are inherently unsafe or unreliable. It shows that composition fails when output-channel authority and tool availability are not explicitly negotiated and verified.

## Proposed solution
A reusable preflight and completion gate that validates channel/tool compatibility, assigns an output contract ID, requires explicit result status/evidence, and prevents ambiguous empty payloads from being treated as verified success.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/86998
- https://github.com/anthropics/claude-code/issues/84093
- https://github.com/anthropics/claude-code/issues/65500
- https://github.com/anthropics/claude-code/issues/83516
