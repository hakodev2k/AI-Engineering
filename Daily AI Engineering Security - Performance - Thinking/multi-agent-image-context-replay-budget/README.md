# Multi-Agent Image Context Replay Budget

**Category:** Performance  
**Run date:** 2026-08-28 (UTC+7)

## Problem
Image-heavy agent workflows can repeatedly serialize and inherit historical image payloads across parent/child threads, compaction passes, and retries. The result is multiplicative input-token processing, network transfer, rollout growth, memory pressure, swap activity, and degraded UI/runtime reliability.

## Evidence
See `evidence/research.md`. Current public reports from OpenAI Codex show this failure mode on macOS and Windows, including one task family with ~1.48B recorded tokens and another workflow with ~9.36 GB of rollout JSONL.

## Existing approach
Prompt caching reduces uncached model processing; context compaction reduces text history; generated-image caches store outputs; users can manually archive/delete work.

## Existing limitations
Caching does not stop repeated large cached contexts from being processed. Compaction may serialize image payloads again. Child agents can inherit parent image history. Archiving may not reclaim all task artifacts. These controls act after growth rather than enforcing per-task resource budgets before fan-out.

## Proposed improvement
Add a deterministic resource-budget gate around image-heavy agent fan-out. Normalize task-family metrics, measure a baseline, block or require explicit narrowing when inherited image bytes or rollout growth exceed policy, and verify before/after resource use.

## Architecture
```text
config/policy.json
scripts/image_context_budget.py
tests/test_image_context_budget.py
skills/image-context-baseline.md
rules/resource-budget.md
subagents/performance-verifier.md
workflows/measure-optimize-verify.md
hooks/pre-subagent-spawn.md
evidence/research.md
```

## Installation
Python 3.10+; no third-party dependencies.

## Configuration
Edit `config/policy.json` to match task-family limits. Start with measurement-only thresholds in staging, then tighten based on observed healthy workloads.

## Usage
Provide normalized JSONL metrics and run:

`python scripts/image_context_budget.py --input metrics.jsonl --policy config/policy.json`

Each line represents a model turn or task checkpoint. Required fields are documented by the script error messages and test fixtures.

## Workflow
Measure baseline → diagnose replay amplification → hypothesize a bounded handoff/reference strategy → apply change → measure again → independently verify. The workflow allows at most two optimization retries.

## Metrics
- inherited image bytes per child
- task-family rollout bytes
- input tokens per model turn
- uncached and cached input tokens
- network bytes when available
- latency per turn
- number of descendants
- budget violations per task family

## Verification
Run `python -m unittest tests/test_image_context_budget.py`. For a real deployment, compare the same representative task before and after the change and require lower resource use without quality regression.

## Safety
The gate never deletes images or rollout files. Cleanup or destructive retention changes require explicit human approval. Required task context MUST NOT be removed solely to reduce cost.

## Failure handling
Detection: non-zero script exit. Evidence: emitted JSON reasons and source metrics. Retry policy: maximum two workflow revisions. Fallback: disable fan-out or pass only explicit image references. Escalation: persistent budget violations or quality regressions. Stop condition: no safe bounded handoff can preserve required context.

## Definition of Done
**Implemented:** pre-spawn gate and normalized metrics are integrated.  
**Measured:** before/after task-family metrics are captured.  
**Verified:** tests pass; p95 latency, rollout growth, or token/byte amplification improves; required context quality remains acceptable; no destructive cleanup occurs without approval.

## Customization
Add platform-specific adapters that emit the normalized JSONL schema; keep this package's policy and verifier platform-neutral.