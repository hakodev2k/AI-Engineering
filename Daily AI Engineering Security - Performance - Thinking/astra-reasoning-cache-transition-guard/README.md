# Astra Reasoning Cache Transition Guard

**Category:** Token

GPT-6 Astra adds a cache-preserving way to change reasoning effort mid-conversation. Long-running agent hosts that continue mutating request-level reasoning settings can remain functionally correct while silently losing reusable prompt-prefix cache benefits. This package measures and gates that transition.

## Evidence
See `evidence/research.md`. OpenAI's current Astra model guidance and 2026-09-03 release notes explicitly describe `configuration_update` as the mechanism for changing effective reasoning effort while preserving the cached prompt prefix. OpenAI Codex #42996 (2026-09-05) reports that current Codex wiring may still use the older request-level path despite having durable configuration-update support; it references earlier empirical cache-regression evidence in #35416.

## Existing approach
Provider prompt caching, stable prefixes, request-level reasoning settings, provider usage fields, and manual before/after comparisons.

## Existing limitations
A request-level change can fragment cache reuse without breaking correctness, aggregate token totals hide the failure, framework serialization support may exist without production transition wiring, and quality can be accidentally traded away for better token metrics.

## Proposed improvement
Treat reasoning effort as an observable conversation-state transition for compatible Astra flows. Capture baseline usage, emit/verify `configuration_update`, measure post-change cache/token/latency behavior, preserve quality, and block optimization claims that exceed thresholds.

## Package tree
```text
astra-reasoning-cache-transition-guard/
├── README.md
├── config/thresholds.example.json
├── evidence/research.md
├── hooks/pre-reasoning-change.md
├── rules/reasoning-cache-preservation.md
├── schemas/usage-event.schema.json
├── scripts/cache_transition_analyzer.py
├── skills/cache-transition-analysis.md
├── subagents/cache-verifier.md
├── tests/test_cache_transition_analyzer.py
└── workflows/measure-migrate-verify.md
```

## Installation
Requires Python 3 only. Copy the package intact. No third-party dependencies are required.

## Configuration
Copy `config/thresholds.example.json` and set thresholds before collecting post-change results. Do not loosen them after seeing a regression merely to obtain a pass.

## Telemetry
Each JSONL row follows `schemas/usage-event.schema.json` and records turn number, input tokens, cached input tokens, latency, effective reasoning effort, transition mode, and quality result. Add provider cost when available.

## Usage
1. Follow `skills/cache-transition-analysis.md` to establish at least three stable baseline turns.
2. Apply one reasoning-effort transition in the representative workload.
3. Capture at least two post-change turns.
4. Run `python scripts/cache_transition_analyzer.py --events <events.jsonl> --thresholds <thresholds.json> --output <report.json>`.
5. Run `python -m unittest tests/test_cache_transition_analyzer.py`.
6. Complete independent review using `subagents/cache-verifier.md`.

## Workflow
`workflows/measure-migrate-verify.md` implements: Observe → Measure baseline → Diagnose → Hypothesize → Implement cache-preserving transition → Measure again → Compare → bounded rework if needed → independent verification.

## Metrics
Tokens/task, cached-input ratio, uncached-input tokens, cost/task when available, latency, context utilization, result quality, and regression rate. The default example thresholds block cache-hit-ratio drops over 0.10, mean input-token increases over 20%, and mean latency increases over 25% around the measured transition.

## Verification
**Implemented:** compatible `configuration_update` path exists and is observable. **Measured:** complete baseline/post-change usage and quality telemetry exists. **Verified:** analyzer returns 0, unit tests pass, transition evidence is `configuration_update` where required, thresholds pass, quality is preserved, and the independent verifier accepts the evidence.

A correctly serialized history item is not sufficient verification if the normal production setting-change path never emits it.

## Safety and correctness
The package MUST NOT remove user requirements, tool state, safety instructions, or other correctness-critical context to improve token metrics. Cache savings never override a quality regression.

## Failure handling
Detection: analyzer exit 2/3, quality failure, missing samples, or inconsistent transition evidence. Evidence: retain JSONL telemetry and analyzer report. Retry policy: maximum two evidence-backed migration/retest cycles. Fallback: revert to the last verified configuration or stable fixed reasoning effort. Escalation: framework/platform owner. Stop when verified, after two failed cycles, or when optimization would require correctness/safety degradation.

## Definition of Done
Current evidence documented; baseline captured; limitation identified; compatible transition implemented; post-change metrics collected; analyzer/tests pass; before/after comparison complete; quality preserved; risks documented; independent verification complete; no blocking token/cache regression remains.

## Customization
Extend telemetry with cost, cache-write tokens, context utilization, request IDs, resume/fork markers, or workload class. Test resume/fork/replay separately when those paths persist configuration state.
