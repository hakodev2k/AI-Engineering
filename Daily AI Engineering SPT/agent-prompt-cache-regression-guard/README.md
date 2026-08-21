# Agent Prompt Cache Regression Guard

## Topic
Detecting and preventing prompt-cache regressions in long-running AI agents and coding-agent runtimes.

## Category
**Performance** (primary), with Token/cost implications.

## Problem
Prompt caching is usually treated as a provider optimization that should improve latency and cost automatically. In practice, long-running agent sessions can experience abrupt cache-read collapses and large cache re-creations. These events may be expected—for example after a model switch, MCP reconnect, compaction or truncation—or unexplained. Without request-level telemetry, teams often discover the problem only after quota, latency or spend has already increased.

The engineering problem is therefore not simply “enable prompt caching.” It is to make cache health observable, distinguish legitimate invalidation from regression, and gate runtime changes against measurable cache behavior without sacrificing correctness or security.

## Evidence
`evidence/research.md` documents current public signals and official platform behavior. Important signals include:
- Claude Code issue #76058 (2026-07-09): repeated active-session cache invalidation/rewrite behavior reported at roughly 11–12 minute intervals;
- Claude Code issue #83542 (2026-08-03): repeated mid-session cache drops with millions of redundant cache-write tokens reported;
- official Claude Code documentation identifying model switches, MCP connect/disconnect, compaction and upgrades as cache invalidators;
- OpenAI API usage fields exposing `cached_tokens`, plus `prompt_cache_key` and `prompt_cache_retention` controls.

These sources establish the problem and observability opportunity. They do not prove every cache miss is a provider bug.

## Existing approach
Common practice is to rely on automatic prompt caching, keep stable prompt content early, avoid unnecessary model/tool changes, and inspect provider usage only when cost looks abnormal.

## Existing limitations
- Session-wide total token counts hide cache composition.
- Average cache-hit rate can hide individual catastrophic resets.
- Manual transcript inspection is reactive and provider-specific.
- Expected lifecycle invalidations create alert noise unless explicitly attributed.
- Cache-related optimizations can accidentally remove required tools/context or reduce correctness.
- A provider's cache internals may not be fully observable, so root-cause claims need calibrated evidence.

## Proposed improvement
This package establishes a cache-regression control loop:

**Instrument → Validate → Baseline → Detect reset → Diff fingerprint → Attribute invalidator → Hypothesize → Controlled experiment → Compare → Independently verify**

The runtime emits provider-neutral telemetry. A deterministic analyzer calculates token-weighted cache ratios, finds strong cache-reset transitions, attributes known invalidators/fingerprint changes, measures latency and enforces configurable thresholds. A separate comparison script gates candidate runtimes against a verified baseline.

## Architecture

```text
Provider/Agent Runtime
        |
        | request usage + lifecycle invalidators
        v
 normalized JSONL telemetry
        |
        v
 scripts/cache_health.py
        |
        +--> validation
        +--> token-weighted metrics
        +--> reset detection
        +--> attribution
        +--> cache health report
                     |
 baseline report ----+---- candidate report
                     |
                     v
        scripts/compare_cache_runs.py
                     |
                     v
              release gate
                     |
          correctness/security tests
                     |
                     v
             independent verify
```

## Package structure

```text
agent-prompt-cache-regression-guard/
├── README.md
├── guide-intergration.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── hooks.md
├── rules/
│   └── engineering-rules.md
├── scripts/
│   ├── cache_health.py
│   └── compare_cache_runs.py
├── skills/
│   └── core-skills.md
├── subagents/
│   └── subagents.md
├── tests/
│   └── test_cache_health.py
├── verification/
│   └── verification.md
└── workflows/
    └── workflows.md
```

## Installation
Requires Python 3.9+ and only the standard library.

```bash
python -m unittest tests/test_cache_health.py
```

No provider SDK is required for the analyzer. The host runtime only needs to emit the documented JSONL telemetry.

## Configuration
Edit `config/policy.json` for your workload:
- `minimum_cache_eligible_input_tokens`: ignore tiny requests that are poor cache-health signals;
- `minimum_expected_cache_read_ratio`: minimum token-weighted read ratio;
- `maximum_unexplained_resets_per_100_requests`: anomaly budget;
- `maximum_cache_creation_amplification`: repeated cache creation budget where creation metrics exist;
- `maximum_p95_latency_regression_percent`: release-gate latency threshold;
- `minimum_requests_for_gate`: minimum evidence volume;
- `known_invalidator_window_requests`: attribution window;
- `stable_fingerprint_fields`: fields that represent cache-relevant configuration.

Thresholds are defaults, not universal truths. Establish a representative baseline before tuning them.

## Telemetry format
Request event:

```json
{
  "type": "request",
  "seq": 42,
  "provider": "openai",
  "model": "example-model",
  "input_tokens": 52000,
  "cache_read_tokens": 47000,
  "cache_creation_tokens": 0,
  "latency_ms": 1840,
  "system_prompt_hash": "sha256:...",
  "tool_schema_hash": "sha256:...",
  "mcp_topology_hash": "sha256:...",
  "reasoning_effort": "medium",
  "prompt_cache_key": "project-agent-v1",
  "compaction_generation": 2
}
```

Known invalidator event:

```json
{"type":"invalidator","seq":42,"kind":"mcp_connect"}
```

Do not write secrets into telemetry or the material used for fingerprints.

## Usage
Validate instrumentation:

```bash
python scripts/cache_health.py validate --input telemetry.jsonl --policy config/policy.json
```

Analyze a run:

```bash
python scripts/cache_health.py analyze \
  --input telemetry.jsonl \
  --policy config/policy.json \
  --output cache-report.json
```

Compare a candidate with baseline:

```bash
python scripts/compare_cache_runs.py \
  --baseline baseline-report.json \
  --candidate candidate-report.json \
  --policy config/policy.json \
  --output comparison.json
```

Exit codes are designed for CI: analyzer returns non-zero for invalid data, policy failure, or insufficient data; comparison returns non-zero when candidate regresses.

## Workflow
Detailed workflows are in `workflows/workflows.md`. The default investigation path is:
1. Capture a representative baseline.
2. Detect first high-read → low-read transition.
3. Compare cache-relevant fingerprints.
4. Attribute configured invalidator events.
5. Produce facts and candidate causes, not hidden chain-of-thought.
6. Run one controlled hypothesis at a time.
7. Allow at most two experiments.
8. Compare baseline/candidate reports.
9. Run correctness/security tests.
10. Have a separate Verification Agent recompute the gate.

## Metrics
Primary metrics:
- cache-read tokens / cache-eligible input tokens;
- cache-creation tokens / cache-eligible input tokens where observable;
- cache-creation amplification;
- unexplained resets per 100 eligible requests;
- p50/p95 latency;
- requests to recover after reset;
- workload correctness/task success.

Use token-weighted ratios. A request-count hit rate can overvalue many tiny requests and hide one huge rewrite.

## Verification
See `verification/verification.md`.

Package-level verification includes deterministic tests for:
- healthy cache reuse;
- unexplained reset detection;
- known invalidator attribution;
- cache-relevant fingerprint mutation;
- malformed usage rejection;
- insufficient-data handling.

During generation, six analyzer contract tests completed with zero failures/errors. Production improvement remains unclaimed until the package is integrated with real baseline/candidate telemetry.

## Safety
- Never remove mandatory system/security instructions to preserve a cache prefix.
- Never disable required tools solely to improve cache ratio.
- Never place credentials in telemetry or fingerprints.
- Analyzer is read-only with respect to provider/runtime state.
- A cache miss is not proof of provider fault.
- Provider metrics that do not exist must be marked unobservable, not estimated as facts.

## Failure handling
**Detection:** malformed telemetry, insufficient samples, cache-health policy failure, comparison regression or missing correctness evidence.

**Evidence:** preserve raw JSONL, generated reports, fingerprint diffs and invalidator events.

**Retry policy:** maximum two controlled experiment iterations; one repeat benchmark is allowed when documented environmental variance invalidates the measurement.

**Fallback:** repair instrumentation or revert the candidate; do not lower thresholds merely to pass.

**Escalation:** unexplained repeated resets with stable fingerprints and no known invalidator should be escalated with reproducible telemetry to the runtime/provider owner.

**Stop condition:** verified pass, verified fail, or bounded inconclusive result.

## Definition of Done
An adoption is complete only when:
- current evidence/limitations are documented;
- telemetry schema is implemented and validates;
- cache-relevant lifecycle invalidators are recorded;
- representative healthy baseline exists;
- candidate run is measured under comparable conditions;
- cache metrics meet configured gates;
- p95 latency does not exceed regression budget;
- unexplained reset threshold is satisfied;
- correctness/security tests pass;
- independent verifier reproduces the decision;
- risks/unobservable fields are documented;
- no blocking cache-performance issue remains.

## Customization
Add provider adapters at the telemetry boundary rather than forking analysis logic. Extend fingerprint fields only with cache-relevant values. Add known invalidator types only when the harness can deterministically observe them. For workloads with short prompts or sparse sessions, adjust eligibility/sample thresholds from measured traffic instead of copying defaults blindly.

For integration details, use `guide-intergration.md`. For operational roles use `subagents/subagents.md`; enforceable controls are in `rules/engineering-rules.md` and hooks are in `hooks/hooks.md`.
