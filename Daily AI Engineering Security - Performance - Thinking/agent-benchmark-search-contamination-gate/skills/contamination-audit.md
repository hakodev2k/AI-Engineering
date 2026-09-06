# Skill: Contamination Audit

## Purpose
Determine from observable evaluation traces whether external retrieval exposed benchmark-specific answer material.

## Trigger
Any public-benchmark run with browser, web search, repository search outside the task snapshot, or external retrieval enabled.

## Inputs
Task identifiers, evaluation trace JSONL, benchmark source map, known answer/gold hashes, URL/text boundary policy.

## Preconditions
The evaluated task version is pinned and the trace collection contract is documented.

## Required context
What external evidence is permitted; which benchmark artifacts are public; expected search/retrieval tools; score-admission policy.

## Allowed tools
Trace parser, deterministic regex/hash matcher, benchmark metadata, independent review of flagged events.

## Constraints
MUST NOT request hidden chain-of-thought. MUST NOT infer clean status from missing telemetry. SHOULD avoid broad patterns that classify ordinary domain terms as contamination.

## Procedure
1. Enumerate every external-search and retrieval tool used by the harness.
2. Establish baseline trace coverage with a clean synthetic run.
3. Define task-specific identifiers and known-answer hashes.
4. Define narrow URL/text patterns for answer-bearing public artifacts.
5. Seed traces with known contamination cases and clean controls.
6. Run `scan_trace_contamination.py`.
7. Classify each run: clean, contaminated, or indeterminate.
8. Compare accepted-score distribution before and after quarantine.
9. Hand flagged/indeterminate cases to an independent verifier.

## Decision points
Any exact task-ID leakage in an external query/URL, forbidden URL/text pattern, or known answer hash is contaminated. Missing trace fields required by policy are indeterminate. Only clean status may enter the benchmark score.

## Expected output
Classification, matched evidence events, coverage metrics and verifier status.

## Metrics
Detection on seeded contamination; false-positive rate; trace completeness; quarantine rate; score delta.

## Verification
Independent verifier repeats the scanner and manually checks each blocking match against observable trace data.

## Failure handling
One retry is allowed when trace export itself failed. Otherwise quarantine and escalate.

## Stop conditions
Status is clean with complete trace, contaminated with evidence, or indeterminate after one trace-export retry.