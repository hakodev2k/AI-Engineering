# Agent Benchmark Search Contamination Gate

Category: Thinking

## Problem
Web-enabled research and coding agents can discover benchmark metadata, task text, known fixes, gold patches, or explicit answers during evaluation. A passing score can therefore measure retrieval of public answer material rather than the intended planning, investigation, coding, or reasoning capability.

## Evidence
A June 2026 study, *Search-Time Contamination in Deep Research Agents*, evaluated modern research agents on six public benchmarks and found search-time contamination was widespread, with measured performance inflation of up to 4%. OpenAI separately concluded on 2026-02-23 that SWE-bench Verified was increasingly contaminated and no longer a reliable frontier coding-capability measure; tested frontier models could reproduce original human-written fixes or benchmark-specific details. These are independent signals covering both active retrieval-time leakage and prior training contamination.

## Existing approach and limitation
Current mitigations include private/held-out tasks, refreshed benchmarks, isolated sandboxes, disabled browsing, contamination scans and post-hoc manual review. These help, but many real agents are specifically evaluated with browsing/search enabled, and disabling tools changes the capability being measured. Private sets also do not explain whether a particular run crossed the evidence boundary.

## Proposed improvement
Attach a contamination provenance gate to evaluation traces. Record every external query, URL, retrieved text identifier and known answer hash; classify the run as clean, contaminated, or indeterminate before accepting its score. Quarantine contaminated or incomplete traces rather than silently counting them.

## Architecture
- `evidence/research.md`: current public evidence and root cause.
- `skills/contamination-audit.md`: reproducible audit procedure.
- `rules/benchmark-evidence-boundary.md`: observable evaluation rules.
- `subagents/independent-eval-verifier.md`: independent verifier.
- `workflows/audit-and-score.md`: bounded evaluation workflow.
- `hooks/pre-score.md`: blocking score-admission hook.
- `scripts/scan_trace_contamination.py`: deterministic JSONL trace scanner.
- `tests/test_scan_trace_contamination.py`: regression tests.

## Installation
Python 3.10+; no third-party dependencies.

## Configuration
Create a JSON policy with `task_ids`, `forbidden_url_regex`, `forbidden_text_regex`, and `forbidden_hashes`. Patterns should identify benchmark-specific answer material, not broad domain vocabulary.

## Usage
Run `python scripts/scan_trace_contamination.py trace.jsonl policy.json`. Exit 0 means the trace is clean under the supplied policy. Exit 1 means contaminated or indeterminate and MUST block score admission. Exit 2 means malformed inputs or configuration.

## Workflow
Observe external retrieval behavior, establish baseline contamination rate, audit trace completeness, apply the gate, rerun seeded fixtures, and have an independent verifier accept or quarantine the run.

## Metrics
Seeded-contamination detection rate; false-positive rate on clean traces; external-search trace coverage; percentage of indeterminate runs; clean-score retention; score delta before/after quarantine.

## Verification
Implemented: gate is connected to all external-search trace sources and score admission. Measured: seeded contamination plus clean traces are run and metrics recorded. Verified: independent reviewer confirms contamination fixtures block, clean fixtures pass, and missing required trace fields cannot be counted as clean.

## Safety
The package does not request hidden chain-of-thought. It operates only on observable queries, URLs, retrieval metadata and content hashes. Do not weaken trace requirements to preserve a benchmark score.

## Failure handling
Detection: malformed trace, missing externally required fields, or ambiguous policy coverage. Retry: one trace-regeneration attempt. Fallback: quarantine as indeterminate. Escalation: benchmark owner. Stop condition: contamination status cannot be established.

## Definition of Done
Current evidence documented; policy defined; trace sources complete; seeded fixtures detected; clean fixtures retained; metrics recorded; verifier independent; score admitted only with clean status; no hidden reasoning collected.