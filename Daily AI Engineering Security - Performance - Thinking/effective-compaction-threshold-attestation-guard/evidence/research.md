# Research — Effective Compaction Threshold Attestation Guard

## Topic
Configured-vs-effective context compaction threshold integrity

## Category
Token

## Problem
Agent runtimes can expose a configured compression/compaction threshold that differs materially from the threshold actually enforced at runtime. Silent floors, ceilings, model metadata resolution, provider limits, and runtime clamps can make token-budget policy ineffective while configuration still appears correct.

## Why it matters now
Long-context agents increasingly depend on automatic compaction to control token cost and latency. Current 2026 reports show configured ratios being silently clamped, warning systems recommending values the runtime will not honor, thresholds scaling to hundreds of thousands of tokens on 1M contexts, and provider/runtime context windows diverging from configured metadata.

## Affected users
AI-agent users, platform engineers, local-model operators, teams with token/cost SLOs, and runtimes using automatic context compression.

## Current public evidence
### Observed evidence
1. Hermes Agent issue #91007, opened 2026-08-20, reports `compression.threshold: 0.6` being silently raised to an effective 75% on a 262,144-token model while `hermes config get` still returns `0.6`. https://github.com/NousResearch/hermes-agent/issues/91007
2. Hermes Agent issue #66177, opened 2026-07-17, reports a configured 30% threshold behaving near 75%, preventing compression and contributing to cascading 429 rate-limit failures on constrained providers. https://github.com/NousResearch/hermes-agent/issues/66177
3. Hermes Agent issue #83450, opened 2026-08-10, reports a ratio-based threshold with no upper token ceiling causing first compaction around 500K tokens on 1M-context models and quadratic session cost growth. https://github.com/NousResearch/hermes-agent/issues/83450
4. Hermes Agent issue #67422 reports warning logic recommending a threshold below a small-context floor that the runtime will not actually honor. https://github.com/NousResearch/hermes-agent/issues/67422
5. Hermes Agent issue #63122 reports compression feasibility decisions trusting configured/advertised Ollama context rather than effective runtime context, producing a false-safe state. https://github.com/NousResearch/hermes-agent/issues/63122
6. Claude Code issue #41037 documents demand for a smaller operating context because large effective windows delay auto-compaction, increasing token use and latency. https://github.com/anthropics/claude-code/issues/41037

## Existing approaches
User-configured compression ratios, model-specific metadata, absolute token thresholds, `/context` or status views, manual compaction, warnings, and provider-side context limits.

## Remaining limitations
Configured values and effective values can be computed in separate layers. A CLI can report source configuration while the compressor applies hidden clamps; model metadata may differ from runtime limits; ratio-only policies ignore latency/cost ceilings; and warnings can be generated from pre-clamp values.

## Root-cause analysis
1. Configuration state is treated as operational truth instead of input to policy resolution.
2. Effective threshold calculation is not exposed as a first-class attested value.
3. Precedence across model metadata, profile settings, floors, absolute thresholds, provider limits, and runtime overrides is hard to inspect.
4. Threshold policy is often expressed as only a percentage even though token count, prefill latency, cost, and provider rate limits matter.
5. Startup does not consistently fail or warn when configured and effective policy diverge materially.

## Improvement opportunity
At session startup and whenever the model/provider changes, compute a normalized attestation containing configured ratio/tokens, effective context window, effective threshold tokens/ratio, clamp reason, and policy limits. Block or warn on unexplained divergence and enforce optional absolute token ceilings.

## Goal
Make the actual compaction trigger observable, machine-verifiable, and aligned with token/cost policy.

## Metrics
- configured/effective threshold ratio delta
- effective threshold tokens
- headroom at compaction
- tokens per task/session
- compactions per session
- prefill latency before compaction
- 429/rate-limit incidents
- attestation mismatch count

## Trigger
Session start, model switch, provider switch, config reload, resume, or runtime context-window change.

## Inputs
Configured ratio/tokens, resolved model context, provider/runtime effective context, actual compressor threshold, policy ceilings/floors.

## Outputs
Attestation JSON, pass/warn/block status, divergence reason, measurable effective budget.

## Proposed solution
A dependency-free attestation script plus rules and workflow that compare configured intent with observed runtime state, reason-code deviations, and enforce an explicit maximum divergence/absolute-token policy without removing context required for correctness.

## Verification
The package is verified when known clamp examples are detected, matching values pass, absolute ceilings block oversize thresholds, and model/runtime context changes force re-attestation.
