# Agent Trace Payload Budget Guard

**Category:** Performance  
**Run date:** 2026-09-04 UTC+7

## Problem
Agent observability can itself become a bottleneck when prompts, tool outputs, documents, images, nested-agent metadata, and rich attributes are serialized into traces without explicit size budgets. Large telemetry can add application latency, memory/network/storage overhead, slow operator UIs, and cross transport limits that drop otherwise valid spans.

## Evidence
See `evidence/research.md` for current public evidence, existing approaches, limitations, root causes, and sources.

## Existing approach
Teams use async/batch exporters, sampling, provider span limits, manual truncation, and observability-backend filtering.

## Existing limitations
Async export does not remove serialization/volume cost; hard size limits can drop entire spans; generic sampling can remove the trace needed for debugging; blanket truncation can destroy causality/error evidence.

## Proposed improvement
Measure payload bytes before optimization, identify dominant span/attribute contributors, enforce configurable per-trace/per-span/per-attribute budgets, preserve protected structural/error fields, and verify before/after workload performance.

## Package tree
```text
README.md
config/payload-budget.json
evidence/research.md
hooks/pre-merge-payload-check.md
rules/trace-payload-rules.md
scripts/trace_payload_profiler.py
skills/trace-payload-analysis.md
subagents/trace-performance-investigator.md
tests/test_trace_payload_profiler.py
workflows/measure-optimize-verify.md
```

## Installation
Python 3.10+; standard library only. Copy the directory intact.

## Configuration
`config/payload-budget.json` defines maximum trace, span, and attribute bytes plus protected diagnostic fields. Tune limits to the exporter/backend and representative production workload.

## Usage
```bash
python scripts/trace_payload_profiler.py traces.jsonl --budget config/payload-budget.json
python scripts/trace_payload_profiler.py traces.jsonl --budget config/payload-budget.json --json-out report.json
python -m unittest tests/test_trace_payload_profiler.py
```
Exit codes: `0` within budget, `2` budget violation, `3` input/config error.

## Workflow
Measure -> diagnose dominant contributors -> form one hypothesis -> optimize one retention path -> measure same workload again -> independently verify diagnostics -> complete or retry. Maximum three optimization iterations.

## Metrics
Total telemetry bytes/task, p50/p95/max span bytes, maximum attribute bytes, exporter drops/errors, tracing-enabled application latency delta, and protected-field coverage.

## Verification
- **Implemented:** profiler, rules, workflow, hook, tests, and budget config exist.
- **Measured:** representative before/after reports and application latency are recorded by the deployment.
- **Verified:** unit tests pass; configured budgets pass after optimization; protected fields remain available; exporter loss is not hidden; independent reviewer accepts the comparison.

## Safety and quality
Do not remove security/audit/error/correlation fields merely for speed. Never claim an improvement from fewer trace bytes alone if result/debugging quality materially regresses.

## Failure handling
Detection: profiler violation, exporter drop/error, trace UI/export regression, or missing protected field. Evidence: retain baseline and optimized reports. Retry: maximum three hypotheses. Fallback: restore prior telemetry configuration. Escalation: observability/platform owner when backend limits dominate. Stop: verified improvement or bounded retry exhaustion.

## Definition of Done
Current evidence documented; baseline captured; dominant contributors identified; improvement implemented; tests pass; before/after metrics exist; protected diagnostic fields retained; exporter drops not hidden; regression risks recorded; independent verification complete; no blocking issue remains.

## Customization
Extend protected fields and workload-specific budgets rather than disabling the guard. If multimodal payloads are required, prefer durable references plus hashes/metadata when full inline content is not needed for routine traces.
