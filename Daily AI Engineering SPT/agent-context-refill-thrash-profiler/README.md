# Agent Context Refill Thrash Profiler

## Topic
Post-compaction context refill thrashing in long-running AI coding agents.

## Category
**Token**

## Problem
Compaction is supposed to free context budget. In practice, a long-running agent can immediately refill that budget with unchanged project instructions, history residue, tool/file payloads or memory. Once the refill interval collapses, the agent repeatedly compacts, burns input tokens, loses forward progress and may eventually fail. Aggressively removing context is also unsafe because required tool state can disappear from the continuation.

## Evidence
Current public signals are documented in `evidence/research.md`:
- Anthropic Claude Code #85489 (2026-08-10): measured autocompact thrashing caused by repeated project-instruction re-injection.
- OpenAI Codex #38466 (2026-08-14): repeated compaction contributes to very large, hard-to-inspect long-running sessions.
- OpenAI Codex #37121 (2026-08-05): truncation plus compaction can make recoverable tool state effectively unavailable to continuation.

## Existing approach
Agent harnesses typically rely on automatic compaction, manual `/compact`/restart workflows, generic oversized-payload warnings and broad summarization.

## Existing limitations
Those approaches primarily manage total history size, not **post-compaction refill velocity**. They often lack source attribution, cannot distinguish duplicated static instructions from legitimately large dynamic state, and may lose required artifacts if compaction becomes too aggressive.

## Proposed improvement
This package adds a deterministic **measure → attribute → gate → mitigate → re-measure** control:
1. instrument each context contribution with source and token count;
2. fingerprint unchanged static payloads;
3. retain durable artifact IDs for required tool/file state;
4. compute refill ratio and refill velocity after compaction;
5. detect duplicate static tokens and compaction density;
6. apply source-specific mitigations only after a baseline exists;
7. independently verify both token savings and task correctness.

## Architecture
The host emits metadata-only JSONL events at the orchestration boundary. `scripts/context_refill_profiler.py` consumes the trace with `config/policy.json`, calculates metrics and returns `PASS` or a non-zero policy violation. The LLM does not decide whether the budget passed; deterministic code does.

For optimization, `subagents/subagents.md` separates profiling, implementation and independent verification responsibilities. `workflows/workflows.md` bounds both mitigation retries and compact-loop recovery.

## Package structure
```text
agent-context-refill-thrash-profiler/
├── README.md
├── guide-intergration.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── skills/
│   └── core-skills.md
├── rules/
│   └── engineering-rules.md
├── subagents/
│   └── subagents.md
├── workflows/
│   └── workflows.md
├── hooks/
│   └── hooks.md
├── scripts/
│   └── context_refill_profiler.py
└── tests/
    ├── pass.jsonl
    └── fail-thrash.jsonl
```

## Installation
Python 3.10+; no third-party dependencies.

```bash
python scripts/context_refill_profiler.py tests/pass.jsonl --policy config/policy.json
```

## Configuration
Edit `config/policy.json` to match the target model and measured workload:
- `context_window_tokens`: target model window.
- `post_compact_turns`: observation window after a compaction.
- `max_refill_ratio_after_window`: maximum allowed refill fraction.
- `max_single_source_ratio`: source-level context-window cap.
- `max_duplicate_static_ratio`: duplicate-static budget.
- `max_compactions_in_20_turns`: compact-loop stop threshold.
- `minimum_attribution_coverage`: required explainability of input tokens.
- `fail_on_missing_required_reference`: fail closed when required state lacks a durable reference.

## Usage
Capture a host trace, then run:

```bash
python scripts/context_refill_profiler.py trace.jsonl \
  --policy config/policy.json \
  --output refill-report.json
```

Exit codes:
- `0`: policy pass;
- `2`: token/refill policy violation;
- `3`: invalid input/config;
- `4`: I/O failure.

The profiler never mutates the repository and does not send telemetry to an external provider.

## Workflow
Use Workflow A in `workflows/workflows.md` for ordinary diagnosis and optimization:
**Observe → Measure → Cause → Hypothesis → Implement → Measure again → Verify.**

Use Workflow B when compaction itself is thrashing. It allows one recovery continuation after persisting a structured checkpoint and removing only the measured redundant source. It deliberately forbids recursive recovery loops.

Use Workflow C as a regression gate whenever instruction loading, memory, compaction, tool serialization, retrieval or model routing changes.

## Metrics
Primary metrics:
- `post_compact_refill_tokens`;
- `refill_ratio`;
- `tokens_per_turn` after compaction;
- `duplicate_static_tokens` and ratio;
- `compaction_count` / rolling compaction density;
- attribution coverage;
- missing required references.

System-level verification should additionally track total tokens/task, cost/task, latency/task and fixed task-suite pass rate.

## Verification
Verification is intentionally separated into three statuses:

### Implemented
Instrumentation, policy and candidate mitigation exist.

### Measured
Equivalent baseline/candidate traces have been profiled and before/after metrics are available.

### Verified
All of the following hold:
- policy report passes;
- duplicated post-compaction static tokens fall by the target amount when duplication existed;
- required artifact-reference loss count is zero;
- attribution coverage meets policy;
- rolling compaction threshold is not violated;
- fixed task verification suite shows no correctness regression;
- security and approval constraints remain pinned.

## Safety
Token reduction is subordinate to correctness and security. The package MUST NOT silently drop active user constraints, security rules, human-approval boundaries, irreversible-operation requirements or required tool/file state. If a large required payload has no recovery path, keep it and treat the budget violation as unresolved.

Telemetry should store token counts, categories, fingerprints and opaque artifact IDs rather than raw sensitive content. Fingerprints are for equality/deduplication, not content reconstruction.

## Failure handling
- **Low attribution coverage:** stop optimization and add instrumentation.
- **Missing required artifact ID:** fail closed before destructive compaction.
- **Candidate quality regression:** revert candidate; do not trade correctness for cost.
- **Budget still failing:** maximum two materially different mitigation attempts per measured source.
- **Compact-loop recovery fails:** stop after one recovery attempt and escalate; never compact indefinitely.
- **Profiler input/config error:** fix trace/config and rerun; do not infer missing measurements.

## Definition of Done
A deployment is complete only when:
1. current evidence and existing limitations are documented;
2. context contributions and compaction events are instrumented;
3. a baseline report is captured;
4. dominant refill source is identified from evidence;
5. mitigation is implemented without silently removing required state;
6. before/after token metrics are collected;
7. policy passes on representative traces;
8. pass/fail fixtures behave as expected;
9. required artifact references are preserved;
10. verification suite passes with no meaningful correctness regression;
11. security/approval boundaries are unchanged or stronger;
12. no blocking failure remains.

## Customization
For smaller context windows, lower absolute budgets but derive ratios from representative baselines. For monorepos, split project instructions into stable domains and assign fingerprints per domain so only relevant/changed domains are loaded. For agent frameworks with artifact stores, map `artifact_id` to immutable tool-result/file-read records. For systems without artifact retrieval, do not remove required verbatim state until an equivalent recovery mechanism exists.

See `guide-intergration.md` for host wiring details and `evidence/research.md` for the research basis.
