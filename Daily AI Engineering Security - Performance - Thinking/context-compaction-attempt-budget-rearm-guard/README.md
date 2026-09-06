# Context Compaction Attempt Budget Rearm Guard

**Category:** Token  
**Date:** 2026-09-06 (Vietnam time, UTC+7)

## Problem
Long tool-heavy turns can fail after exhausting a context-compression attempt counter even when earlier compactions succeeded. The failure is more likely when pluggable context engines do not expose the private state that core re-arm logic expects.

## Evidence
See `evidence/research.md`. The strongest current signal is Hermes Agent issue #103355 from 2026-09-05. It is reinforced by issue #72451, which documents successful in-place compression consuming a shared per-turn attempt budget, and by current Hermes context-engine documentation describing a public pluggable engine abstraction.

## Existing approach
Hermes uses bounded compression attempts, token thresholds, context-engine plugins, fallback routes, and post-request token observations. Bounded attempts are an important stop condition for failed/no-progress loops.

## Existing limitations
The attempt budget can conflate successful maintenance with failure retries; re-arm semantics can depend on implementation-private state; and blindly resetting after each `compress()` would create an infinite-loop risk.

## Proposed improvement
Use an explicit progress contract. A compression cycle is eligible to re-arm the failure budget only after measurable token reduction, threshold clearance, and a subsequent successful request below threshold. Failed/no-progress compression continues to consume a bounded failure budget. Built-in and plugin engines use the same observable result fields.

## Architecture
- `evidence/research.md` — current evidence, approaches, limitations, and root causes.
- `skills/compaction-budget-diagnosis.md` — evidence-driven diagnosis procedure.
- `rules/compaction-budget-rules.md` — enforceable retry/re-arm invariants.
- `subagents/context-budget-verifier.md` — independent verifier role.
- `workflows/measure-rearm-verify.md` — baseline, diagnosis, bounded improvement, and verification workflow.
- `hooks/post-compaction-budget-check.md` — deterministic verification hook.
- `config/thresholds.json` — safe default verification policy.
- `scripts/check_compaction_budget.py` — dependency-free JSONL trace analyzer.
- `tests/test_check_compaction_budget.py` — regression tests.

## Actual package tree
```text
context-compaction-attempt-budget-rearm-guard/
├── README.md
├── config/
│   └── thresholds.json
├── evidence/
│   └── research.md
├── hooks/
│   └── post-compaction-budget-check.md
├── rules/
│   └── compaction-budget-rules.md
├── scripts/
│   └── check_compaction_budget.py
├── skills/
│   └── compaction-budget-diagnosis.md
├── subagents/
│   └── context-budget-verifier.md
├── tests/
│   └── test_check_compaction_budget.py
└── workflows/
    └── measure-rearm-verify.md
```

## Installation
Requires Python 3.10+ and no third-party dependencies. Copy the complete package into the target agent-runtime or observability repository.

## Configuration
`config/thresholds.json` provides defaults for verification. The runtime being tested remains the source of truth for its actual context threshold and failure-attempt cap; do not silently modify production limits just to satisfy this package.

## Trace format
Each JSONL line is an ordered event. Compression result example:
```json
{"type":"compaction_result","outcome":"success","before_tokens":150000,"after_tokens":80000,"threshold_tokens":100000}
```
Subsequent request example:
```json
{"type":"model_request","success":true,"prompt_tokens":85000,"threshold_tokens":100000}
```
Optional terminal marker:
```json
{"type":"turn_end","reason":"completed"}
```

## Usage
From the package root:
```bash
python3 scripts/check_compaction_budget.py --trace compaction-trace.jsonl --max-failures 3
python3 -m unittest discover -s tests -p 'test_*.py'
```
Exit code `0` means the trace satisfies the verifier; `2` means a semantic violation; `3` means invalid input.

## Workflow
Observe → capture baseline → classify attempts → identify private-contract or accounting gap → implement normalized progress result → measure again → re-evaluate at most 2 times → independent verification → complete.

## Metrics
- Max-attempt terminations per 100 long turns.
- Successful compactions before termination.
- Tokens reclaimed per compaction.
- Compression latency.
- Input tokens/task and total tokens/task.
- Failure-budget utilization.
- Unsafe re-arms: target 0.
- Missed re-arms in verified-progress fixtures: target 0.
- Context/correctness regression rate: must not increase.

## Verification
**Implemented:** deterministic trace analyzer, rules, hook, workflow, independent verifier role, configuration, and tests are present.  
**Measured:** adopters capture baseline and post-change traces using identical workloads/configuration where practical.  
**Verified:** valid-progress fixtures re-arm, no-progress attempts remain bounded, malformed telemetry fails closed, plugin engines use the same public result semantics, and no correctness-critical context is removed merely to reduce token use.

## Safety
This guard does not remove the retry cap. It does not permit unbounded compression. It does not lower context needed for correctness. Re-arm requires objective progress evidence and a successful subsequent request.

## Failure handling
Detection: max-attempt termination after prior verified progress, failure-budget overflow, unsafe re-arm, or invalid/missing telemetry. Evidence: preserve the ordered trace and active configuration. Retry policy: at most one telemetry recollection and at most 2 implementation iterations. Fallback: retain the prior bounded behavior and surface the failure. Escalation: context-runtime owner. Stop condition: verified pass or retry exhaustion.

## Definition of Done
- Current evidence and existing approaches documented.
- Baseline captured.
- Public progress contract implemented without private-engine coupling.
- Failure/no-progress attempts remain bounded.
- Verified successful progress re-arms the failure budget.
- Tests pass.
- Before/after metrics collected.
- Token/cost/latency impact measured where available.
- No correctness-critical context loss introduced.
- Independent verification complete.
- No blocking issue remains.

## Customization
Add engine-specific telemetry adapters upstream, but normalize them into the same trace fields before verification. If an engine cannot provide before/after token evidence, classify that cycle as unverifiable rather than assuming progress.
