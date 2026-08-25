# Research — Agent Version Resume Cache Boundary Guard

## Topic
Version-aware prompt-cache continuity across paused/resumed AI coding sessions.

## Category
Token

## Problem
Long-running agent sessions can lose a previously warm prompt prefix when the host binary, model/effort configuration, or reconstructed system/history blocks change between pause and resume. The next turn may rewrite hundreds of thousands of cached tokens even though the user task and repository are unchanged.

## Why it matters now
In August 2026, multiple Claude Code reports show reproducible one-turn cache collapses caused by background auto-update, resume-state drift, and hook-provided context mutation. Anthropic also explicitly warns that changing model or effort mid-conversation can bust prompt cache. This creates avoidable cost and latency precisely on long sessions where prefixes are largest.

## Affected users
Developers using resumable coding sessions; teams with long context; platforms that auto-update agents; hosts that rebuild tool/hook context; cost-sensitive API users.

## Current public evidence
### Observed evidence
1. Claude Code issue #86244, opened 2026-08-13, reports a background update from 2.1.228 to 2.1.229 followed by a resume where cache creation jumped to ~794k tokens after a 34-minute pause despite a one-hour cache tier; the following turn became warm again. https://github.com/anthropics/claude-code/issues/86244
2. Claude Code issue #83913, opened 2026-08-04, isolates cache invalidation caused by `PreToolUse`/`PostToolUse` `additionalContext` changing when history is rebuilt. https://github.com/anthropics/claude-code/issues/83913
3. Anthropic's 2026-08-14 Claude Code guidance says changing model or effort mid-conversation can bust prompt cache. https://claude.com/blog/maximizing-the-value-of-your-claude-code-sessions
4. The Last Harness issue #468, opened 2026-08-08, reports full cache invalidation when extension-injected subagent notification turns drop the primary system prompt. https://github.com/diegopetrucci/the-last-harness/issues/468

## Interpretation
The recurring engineering failure is not simply 'cache misses'. It is failure to treat the effective prompt prefix as a versioned artifact whose identity must remain stable across resume/rebuild boundaries.

## Existing approaches
Provider prompt caching; cache-hit telemetry; manual avoidance of mid-session model changes; generic cache-regression alarms; long-context cold-cache recovery.

## Remaining limitations
Generic monitors detect the expensive turn after it occurs. They do not preflight resume against the previous session's effective prefix identity, distinguish expected TTL expiry from structural drift, or identify which boundary component changed.

## Root-cause analysis
- Host/version changes silently alter generated system/tool blocks.
- Resume reconstruction is not bound to a durable prefix fingerprint.
- Model/effort/tool/hook configuration may drift independently.
- Telemetry often aggregates cache reads/writes without causal boundary metadata.

## Improvement opportunity
Persist a privacy-safe fingerprint of cache-relevant components at each checkpoint. Before resume, compare current runtime/model/effort/tool-schema/hook-context identities with the saved boundary. Classify drift, warn or stage a deliberate cold-start, and record the exact cause so operators do not misdiagnose normal TTL expiry.

## Inputs / Outputs
Inputs: checkpoint manifest JSON and current resume manifest JSON. Outputs: deterministic drift report, severity, changed components, and exit status.

## Metrics
cache_create_tokens on first resumed turn; cache_read_ratio; resume cold-start rate; drift causes/session; avoidable cache rewrite tokens; latency-to-first-useful-action.

## Verification
Fixtures MUST prove identical manifests pass, semantic cache-key fields changing fail, volatile non-cache metadata is ignored, and reports identify changed components without storing prompt text or secrets.

## Proposed solution
A manifest/fingerprint script, rules, pre-resume hook, analysis skill, independent verifier, bounded workflow, and tests.