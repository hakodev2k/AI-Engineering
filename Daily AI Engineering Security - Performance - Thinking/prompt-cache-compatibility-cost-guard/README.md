# Prompt Cache Compatibility Cost Guard

**Category:** Token

## Problem
Long-running agent sessions increasingly depend on prompt caching for both latency and cost, but provider/model capability drift can cause hard request failures, expensive cache rewrites, or silent full-price misses. The failure is operational rather than theoretical: clients may keep deprecated cache fields, omit explicit breakpoints, compact at cache-hostile boundaries, or expose too little telemetry to distinguish reads from writes.

## Evidence
See `evidence/research.md` for current August 2026 evidence from OpenAI Codex issues, OpenAI API documentation, Amazon Bedrock guidance, and an independent Hermes Agent report.

## Existing approach
Current guidance recommends stable-prefix placement, explicit cache breakpoints for GPT-5.6-family agentic loops, model-compatible cache option fields, and monitoring cache read/write token counters.

## Existing limitations
- Client/provider option schemas can drift independently.
- A request can be syntactically valid yet economically poor when cache writes dominate reads.
- Session compaction can create new prefixes and force rewrites.
- Many agent runtimes lack a deterministic preflight gate tying model capability, TTL, breakpoint mode, and budget thresholds together.

## Proposed improvement
Add a reusable pre-request compatibility and economics gate. It validates request cache options against a declarative model policy, rejects deprecated or unsupported fields, estimates write/read economics from recent telemetry, and blocks or warns before a costly or incompatible request is sent.

## Architecture
```text
config/cache-policy.json
scripts/cache_guard.py
tests/test_cache_guard.py
skills/cache-economics-analysis.md
rules/prompt-cache-contract.md
subagents/cache-verifier.md
workflows/measure-and-migrate.md
hooks/pre-request.md
evidence/research.md
README.md
```

## Installation
Python 3.10+; standard library only.

## Configuration
Edit `config/cache-policy.json` to describe supported fields, allowed TTLs, write/read budget thresholds, and model aliases. Do not add a field unless the target provider/model documents it.

## Usage
```bash
python scripts/cache_guard.py --request request.json --usage usage.json --policy config/cache-policy.json
```

The request file contains model and cache options. The usage file contains recent aggregated `input_tokens`, `cache_read_tokens`, and `cache_write_tokens`.

## Workflow
1. Capture baseline cache telemetry.
2. Detect unsupported/deprecated request fields.
3. Calculate cache read/write ratios and estimated relative input cost.
4. Form a migration or breakpoint hypothesis.
5. Change one cache-control variable at a time.
6. Measure again.
7. Verify quality and failure rate are unchanged or improved.

## Metrics
- request validation failure rate
- cache read ratio
- cache write ratio
- write-to-read token ratio
- estimated cache-adjusted input cost/task
- request retry rate
- task success/regression rate

## Verification
Run:
```bash
python -m unittest tests/test_cache_guard.py
```

## Safety
The guard never sends model requests and never reads credentials. It MUST fail closed on an explicitly unsupported cache parameter. Cost optimization MUST NOT remove context required for correctness.

## Failure handling
Detection produces machine-readable reasons. Retry policy is at most two configuration revisions. Fallback is provider-default caching with no deprecated fields. Escalate when provider documentation and observed API behavior conflict.

## Definition of Done
**Implemented:** guard, policy, hook, workflow, rules, and tests are present.  
**Measured:** baseline and post-change cache counters are captured.  
**Verified:** compatibility tests pass, write/read economics improve or remain within budget, task-quality checks show no critical context loss, and no blocking incompatibility remains.

## Customization
Extend model policies conservatively. Keep capability validation separate from economic thresholds so a team can tighten budgets without weakening compatibility checks.
