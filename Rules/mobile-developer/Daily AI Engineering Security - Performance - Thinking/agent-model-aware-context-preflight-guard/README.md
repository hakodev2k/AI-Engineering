# Agent Model-Aware Context Preflight Guard

## Topic

Prevent AI-agent context-window failures and premature compaction caused by stale, heuristic, or wrong-model token accounting.

**Category:** Token  
**Generated:** 2026-08-20 (UTC+7)

## Problem

Agent runtimes often decide whether a request fits using byte/character heuristics, previous-turn token usage, or the coordinator model's context size. Those values can diverge from the final request actually sent after system prompts, tool schemas, retrieved content, memory, subagent routing, and provider wrappers are applied. Token-dense JSON/code/non-ASCII inputs can invalidate fixed ratios; mixed-model subagents can inherit a context limit that does not belong to their target model.

The result is wasted quota, `context_length_exceeded`, unrecoverable retry loops, or unnecessary early compaction that throws away useful context.

## Evidence

Current public signals are documented in `evidence/research.md`. The strongest include:

- OpenAI Codex #35093 (2026-07-24): fixed `4 bytes/token` truncation can exceed real context on token-dense inputs.
- OpenAI Codex #37135 (2026-08-05): estimated usage can overwrite measured post-compaction usage and shift decisions.
- OpenAI Codex #36806 (2026-08-03): oversized background transcripts can fail after consuming quota.
- Claude Code #83355 (2026-08-02): subagent auto-compaction can use the main session's larger context window rather than the subagent model's limit.

These are observed upstream signals; this package's guard architecture is a proposed reusable engineering response.

## Existing approach

Common approaches include fixed byte/character ratios, stale provider usage counters, global session limits, automatic truncation/compaction, provider/local tokenizer counting, and conservative estimates.

## Existing limitations

- Heuristic token ratios are content-dependent.
- Previous response usage does not include newly appended content.
- Counting can happen before final request rendering.
- Coordinator and subagent models may have different context windows/tokenizers.
- Retrying the same oversized payload cannot fix a deterministic budget failure.
- Silent reduction can damage correctness if required facts/constraints are discarded.
- Without estimate-vs-measured telemetry, fallback heuristics cannot be safely calibrated.

## Proposed improvement

Treat context budgeting as a **request-admission boundary**:

`render final request -> resolve actual model -> count -> reserve -> decide -> reduce/recount if needed -> send -> reconcile measured usage`

The guard prefers an exact/provider-compatible tokenizer result. A conservative fallback is allowed only below a configurable utilization ceiling and is never labeled exact. Near the boundary, lack of an authoritative count blocks the send rather than gambling on a universal ratio.

## Architecture

1. **Model registry / router metadata** supplies target model and authoritative effective limit.
2. **Final request renderer** produces the exact provider-bound artifact.
3. **Counter adapter** returns exact/provider count when available.
4. **Preflight guard** computes admissible input after output/reasoning reserves and safety margin.
5. **Reduction workflow** removes duplicate/stale/low-relevance context while protecting requirements/evidence.
6. **Provider call** happens only after `ALLOW`.
7. **Telemetry reconciler** compares estimated with provider-measured usage for calibration.
8. **Verification agent/tests** challenge token-dense and mixed-model cases independently.

## Package structure

```text
agent-model-aware-context-preflight-guard/
├── README.md
├── guide-intergration.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── examples/
│   └── model-registry.example.json
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
│   ├── context_preflight.py
│   └── token_budget_report.py
├── tests/
│   └── test_context_preflight.py
└── verification/
    └── verification.md
```

## Installation

Requires Python 3.10+ and no third-party package for the included guard/report scripts.

Copy the package into the agent runtime repository. Keep `config/policy.json` under version control. Add a versioned model registry based on `examples/model-registry.example.json` using current authoritative provider metadata.

An exact counter adapter is strongly recommended. It may be a provider token-count endpoint or a local tokenizer compatible with the selected model. The included guard intentionally does not embed provider credentials or network calls.

## Configuration

Key policy values:

- `default_safety_margin_ratio`: percentage of model capacity kept unused;
- `minimum_safety_margin_tokens`: absolute minimum margin;
- `reserve_output_tokens` / `reserve_reasoning_tokens`: capacity excluded from input admission;
- `exact_counter_required_above_utilization`: force authoritative counting near the boundary;
- `fallback.max_utilization`: maximum utilization at which heuristic fallback may admit;
- `fallback.bytes_per_token_floor`, `chars_per_token_floor`, `multiplier`: conservative fallback parameters to calibrate from measured traffic;
- reduction/retry bounds preventing infinite compact-retry loops.

Do not copy example context limits into production without checking current provider/model documentation.

## Usage

With an authoritative exact count for the final request:

```bash
python scripts/context_preflight.py check \
  --request request.json \
  --model provider/model-a \
  --context-limit 200000 \
  --exact-count 142350 \
  --policy config/policy.json
```

Without `--exact-count`, the guard uses conservative estimation. It returns `RECOUNT_REQUIRED` near the configured boundary rather than pretending the estimate is precise.

Exit codes:

- `0` — `ALLOW`
- `2` — `REDUCE`
- `3` — `RECOUNT_REQUIRED`
- `4` — invalid/missing configuration

After the provider returns measured usage, record estimate error:

```bash
python scripts/token_budget_report.py append \
  --log token-budget.jsonl \
  --request request.json \
  --model provider/model-a \
  --estimated 145000 \
  --measured 142350
```

Summarize calibration data:

```bash
python scripts/token_budget_report.py summarize --log token-budget.jsonl --model provider/model-a
```

The summary exits non-zero if under-count records exist, making it suitable for a calibration/CI gate.

## Workflow

Use Workflow A in `workflows/workflows.md` for every model call. If it returns `REDUCE`, run Workflow B with protected context IDs, then re-render and recount. Use Workflow C to investigate new context errors or accounting drift.

A provider `context_length_exceeded` error is not a transient retry. The rejected request hash must not be resubmitted unchanged.

## Metrics

Track at minimum:

- preflight coverage;
- target-model metadata coverage;
- exact/provider counter coverage;
- input count, admissible count, headroom and utilization;
- estimate-vs-measured error by model/tokenizer version;
- reduction count/tokens removed;
- locally caused context errors;
- identical oversized retries;
- protected-context retention/regression failures.

Target package metrics are defined in `evidence/research.md`.

## Verification

Run:

```bash
python -m unittest tests/test_context_preflight.py
```

The suite includes exact fit/overflow, token-dense ASCII, Unicode, near-boundary estimated requests, request-hash identity, and invalid configuration.

`verification/verification.md` distinguishes **Implemented**, **Measured**, and **Verified**. During this generation run, direct retrieval/execution from `raw.githubusercontent.com` was blocked by DNS in the local execution container; therefore the report does not falsely claim the GitHub-saved unit suite executed there. The GitHub manifest is verified through the repository integration.

Production verification requires replaying representative, non-sensitive requests with the authoritative model tokenizer/provider count and proving zero local context overflow plus no protected-context loss.

## Safety

- Never remove security rules, authorization requirements, human approvals, active user constraints, or verification evidence merely to fit the window.
- Never log prompt bodies/secrets for token telemetry when a request hash and numeric counters suffice.
- Never route to a more privileged or costly model silently.
- Unknown model capacity or near-boundary heuristic-only counts fail closed.
- The implementation agent must not be the sole verifier for high-impact integrations.

## Failure handling

**Missing model metadata:** block; fix registry/router propagation.  
**Exact counter unavailable:** conservative fallback only below configured ceiling; otherwise recount/block.  
**Oversized request:** bounded evidence-preserving reduction, maximum two rounds.  
**Provider context error:** no identical retry; capture request hash and rebuild.  
**Estimate drift:** disable permissive fallback for affected model/version until recalibrated.  
**Required content itself exceeds capacity:** split task or request explicit approved routing; do not silently delete requirements.

## Definition of Done

For package generation:

- current evidence documented;
- existing approaches and limitations analyzed;
- actionable Skills, Rules, Subagents, Workflows and Hooks generated;
- deterministic scripts generated with validation and meaningful exit codes;
- regression tests and integration guide generated;
- verification status and residual risks documented;
- README references only generated artifacts;
- GitHub manifest verified after save.

For production adoption:

- 100% provider-call preflight coverage;
- 100% target-model metadata coverage;
- authoritative counting near the context boundary;
- regression suite passes;
- representative replay corpus shows zero local `context_length_exceeded`;
- zero identical oversized retries;
- fallback holdout corpus has zero unsafe under-counts beyond configured margin;
- protected context is preserved;
- estimate drift/telemetry is observable;
- no blocking security or correctness issue remains.

## Customization

Tune reserves/margins per provider/model and workload. Add adapters for multimodal token counting, provider-specific tool/schema overhead, and exact token-count APIs. Extend reduction priorities for your RAG/memory system, but preserve the MUST/MUST NOT rules. Keep calibration segmented by model/tokenizer version and rerun verification whenever prompt templates, model routing, tool schemas, context assembly, or tokenizer behavior changes.
