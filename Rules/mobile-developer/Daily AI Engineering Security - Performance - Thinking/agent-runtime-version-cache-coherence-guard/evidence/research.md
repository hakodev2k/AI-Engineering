# Research — Agent Runtime Version Cache Coherence Guard

## Topic
Agent Runtime Version Cache Coherence Guard

## Category
Token

## Problem
Long-running AI coding sessions can lose prompt-cache reuse when the same logical session is resumed by a different client build, entrypoint, or auto-updated runtime. The cache miss may be technically valid because the serialized system/context prefix changed, but the user experiences a sudden full-context rewrite, higher cost, increased latency, and sometimes immediate quota exhaustion.

## Why it matters now
Several August 2026 Claude Code reports show large sessions rebuilding hundreds of thousands of cached tokens because of client-version changes rather than task-content changes. This is especially damaging in long sessions where a single resume can rewrite 700k–900k tokens.

## Affected users
Developers using long-lived agent sessions, IDE and CLI combinations, headless resume jobs, background automation, enterprise agent hosts, and platform teams that depend on prompt caching for cost/latency control.

## Current public evidence
### Observed evidence
1. Claude Code issue #86244, opened 2026-08-13, reports a background auto-update from 2.1.228 to 2.1.229 after a 34-minute pause. The resumed session dropped from roughly 890k cache-read tokens to about 22k and rebuilt roughly 794k cache-create tokens. The reporter ruled out TTL expiry and compaction and observed normal cache reuse immediately after the rebuild. Source: https://github.com/anthropics/claude-code/issues/86244
2. Claude Code issue #86749, opened 2026-08-14, reports a generated cron job resuming a VS Code session with a stale standalone CLI (2.1.207 while the maintained client was 2.1.231). Each resume reported `system_changed` and rebuilt about 760k one-hour-cache tokens. Source: https://github.com/anthropics/claude-code/issues/86749
3. Claude Code issue #83913, opened 2026-08-04, shows that changing hook-provided `additionalContext` during history rebuild can invalidate an otherwise reusable prefix. This demonstrates that cache identity can be sensitive to system/context reconstruction details, not just visible user content. Source: https://github.com/anthropics/claude-code/issues/83913
4. Anthropic prompt-caching documentation explains that cache hits require an exact prefix match up to a cache breakpoint, so any upstream system/tool/context difference can force new cache creation. Source: https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching

## Existing approaches
- Rely on provider prompt caching and accept occasional cache misses.
- Pin a CLI version manually.
- Keep long sessions within one client process.
- Inspect transcript usage after unexpected cost spikes.
- Use longer cache TTLs where supported.

## Remaining limitations
Manual version pinning does not protect multi-entrypoint environments where IDE, CLI, cron, SDK, and background jobs use different binaries. A longer TTL does not help if the effective prefix changes. Post-hoc transcript inspection finds the problem only after cost and latency have already been paid. Existing cache metrics often identify a miss but do not block a resume that is predictably incoherent with the session's originating runtime fingerprint.

## Root-cause analysis
- Session identity and runtime identity are treated as separate concerns even though prompt-cache identity depends on runtime-generated prefix material.
- Resume paths often do not verify that model, client version, entrypoint, hooks, system instructions, and tool manifests match the session's previous stable fingerprint.
- Auto-update and stale binary discovery can change one component without invalidating or re-baselining the session intentionally.
- Hosts commonly lack a pre-resume cost estimate for a likely cold cache rebuild.
- Concurrent IDE/headless resumes may alternate between different fingerprints and repeatedly destroy reuse.

## Improvement opportunity
Persist a cache-coherence fingerprint alongside each resumable session and compare it before resume. The fingerprint should include only deterministic cache-relevant fields: provider/model, client build, entrypoint, system-instruction hash, hook-context hash, tool-schema hash, and selected cache policy. For large sessions, block or require explicit override when the fingerprint changes and the predicted rewrite exceeds a configured threshold. After an intentional migration, re-baseline once and verify that subsequent turns are warm.

## Interpretation
The reports do not prove that every version change must invalidate every provider cache. They do show a recurring operational failure mode where runtime/context reconstruction changes cause expensive misses that can be predicted from observable metadata before resume.

## Proposed solution
A reusable pre-resume coherence gate plus after-resume verifier. It does not attempt to force a provider cache hit. It prevents accidental high-cost resumes across incompatible runtime fingerprints, records intentional migrations, and verifies whether the new baseline becomes stable.

## Goal
Reduce avoidable full-prefix cache rewrites caused by runtime-version or entrypoint skew without hiding legitimate cache invalidation.

## Metrics
- Predicted cache-rewrite tokens per resume.
- Actual `cache_creation_input_tokens` and `cache_read_input_tokens` on the first two resumed requests.
- Cache reuse ratio = cache_read / (cache_read + cache_creation).
- Number of blocked mismatched resumes.
- Number of repeated mismatched resumes within one session.
- Cost and latency delta before/after guard adoption.

## Trigger
Before resuming a persisted AI-agent session; after client auto-update; when launching a headless continuation; when switching IDE/CLI/SDK entrypoints; or when a large unexpected cache miss is observed.

## Inputs
Session metadata, current runtime fingerprint, prior stable fingerprint, estimated current context tokens, cache policy, and optional human-approved migration reason.

## Outputs
`allow`, `rebaseline_required`, or `block`; mismatch list; predicted rewrite size; audit record; and post-resume verification result.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/86244
- https://github.com/anthropics/claude-code/issues/86749
- https://github.com/anthropics/claude-code/issues/83913
- https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching
