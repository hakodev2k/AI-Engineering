# Auxiliary Inference Context Occupancy Isolation Guard

**Category:** Performance

## Problem
Nested/auxiliary inference (advisor, reviewer, helper model, subagent) can have its token usage folded into the parent session's context-occupancy signal. The parent then compacts too early; the inverse error can undercount provider context and overflow.

## Evidence
See `evidence/research.md` for current reports and existing approaches.

## Proposed improvement
Separate **billable usage**, **child inference usage**, and **parent prompt occupancy**. Derive compaction eligibility only from a provider-validated parent occupancy signal, while retaining child usage for cost accounting.

## Package tree
```text
README.md
evidence/research.md
config/policy.json
scripts/check_occupancy.py
tests/test_check_occupancy.py
rules/occupancy-isolation.md
skills/occupancy-diagnosis.md
subagents/benchmark-verifier.md
hooks/post-auxiliary-inference.md
workflows/measure-isolate-verify.md
```

## Usage
`python scripts/check_occupancy.py trace.json --policy config/policy.json`; Python 3.10+, standard library only.

## Metrics
Parent prompt tokens, auxiliary tokens, reported total, occupancy error %, compactions/task, overflow errors, latency/task and token cost/task.

## Verification
Run `python -m unittest tests/test_check_occupancy.py`, then replay representative advisor/auxiliary workloads before and after the runtime change. Improvement requires lower occupancy error and fewer spurious compactions/overflows without hiding billable child usage.

## Safety
Do not suppress real provider usage or raise limits to mask overflow. Cost accounting and context occupancy remain separate ledgers.

## Failure handling
Malformed evidence exits 3; policy breach exits 2. Retry diagnosis at most twice; restore the last known-good occupancy source on failure.

## Definition of Done
Implemented artifacts exist; baseline and after traces are measured; tests pass; occupancy error is within policy and spurious compaction/overflow regression is absent.