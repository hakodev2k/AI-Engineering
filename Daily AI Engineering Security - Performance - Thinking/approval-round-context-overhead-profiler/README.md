# Approval Round Context Overhead Profiler

**Category:** Performance

## Problem
Approval middleware can re-enter the agent multiple times inside one logical turn. Expensive context providers may therefore repeat DB memory, RAG, summarization, or compaction work per approval round.

## Evidence
See `evidence/research.md` for current public reports from Microsoft Agent Framework issues #6825, #6910, and #7043.

## Existing approach and limitation
Framework approval wrappers preserve safety but can change the cost model of a tool-heavy turn. Application caching helps only when provider inputs and mutation boundaries are understood. Removing approval is not an acceptable optimization for genuinely gated tools.

## Proposed improvement
Instrument logical turns, approval rounds, providers, stable input fingerprints, and duration. Detect repeated equivalent provider work and permit logical-turn-scoped reuse only for explicitly read-only deterministic providers.

## Package tree
```text
approval-round-context-overhead-profiler/
├── README.md
├── evidence/research.md
├── config/policy.json
├── skills/profile-context-overhead.md
├── rules/performance-and-approval-rules.md
├── workflows/measure-optimize-verify.md
├── hooks/overhead-regression-check.md
├── scripts/analyze_overhead.py
└── tests/test_analyze_overhead.py
```

## Installation
Python 3.10+ is sufficient for the analyzer. Tests require `pytest`.

```bash
python -m pip install pytest
```

## Configuration
Adjust thresholds in `config/policy.json`. Keep `never_bypass_required_approval` enabled. Runtime adapters should emit JSONL fields documented in the skill.

## Usage
Analyze a trace:

```bash
python scripts/analyze_overhead.py trace.jsonl
```

Compare a candidate against baseline:

```bash
python scripts/analyze_overhead.py candidate.jsonl --baseline baseline.jsonl --policy config/policy.json --strict
```

## Workflow
Follow `workflows/measure-optimize-verify.md`: Observe → Measure baseline → Diagnose → Hypothesize → Optimize → Measure again → Verify. Maximum optimization hypotheses: 2.

## Metrics
Provider invocations/turn, repeated provider invocations, provider milliseconds/turn, p95 provider time, approval rounds/turn, timeout/error rate, and repeated-work savings.

## Verification
Run:

```bash
pytest -q tests/test_analyze_overhead.py
python scripts/analyze_overhead.py candidate.jsonl --baseline baseline.jsonl --policy config/policy.json --strict
```

An optimization is **Implemented** when instrumentation/change exists, **Measured** when equivalent baseline/candidate traces exist, and **Verified** only when tests pass, required approval behavior is unchanged, and policy thresholds pass.

## Safety
This package never treats approval removal as a performance technique. Mutable or nondeterministic providers are measurement-only unless they publish an explicit reuse contract.

## Failure handling
Invalid telemetry blocks analysis. A performance regression, increased errors, changed outputs/side effects, or changed approval behavior blocks completion. Benchmark noise may be recollected once; optimization hypotheses are bounded to two.

## Definition of Done
- Current evidence documented.
- Baseline captured.
- Repeated work identified with stable fingerprints.
- Optimization eligibility justified.
- Candidate measured against equivalent fixtures.
- Required approvals preserved.
- Tests and strict regression gate pass.
- No blocking correctness or security regression remains.

## Customization
Add framework adapters that emit the documented JSONL schema, additional provider-specific fingerprints, and organization-specific latency/timeout thresholds without weakening the approval rules.
