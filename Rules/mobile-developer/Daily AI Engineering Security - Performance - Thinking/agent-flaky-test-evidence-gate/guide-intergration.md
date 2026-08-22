# Integration Guide

## Integration objective
Insert the evidence gate between test failure observation and agent decisions. The host/orchestrator—not a prompt alone—should enforce that failure-driven edits and completion claims have supporting run records.

## Required integration points

### 1. Test execution wrapper
Route verification commands that may influence agent decisions through `scripts/run_repeated_command.py` when repeated evidence is required. The wrapper records every observation in JSONL and does not discard failures when a later run passes.

Example:

```bash
python scripts/run_repeated_command.py \
  --runs 3 \
  --timeout 600 \
  --output artifacts/baseline-runs.jsonl \
  -- dotnet test tests/MyProject.Tests --filter FullyQualifiedName~TargetTest
```

For npm/pytest/cargo/etc., replace only the command after `--`.

### 2. Classification boundary
After collecting runs, classify them deterministically:

```bash
python scripts/classify_test_signal.py \
  --input artifacts/baseline-runs.jsonl \
  --policy config/policy.json \
  --json-output artifacts/baseline-classification.json
```

The orchestrator should branch on `classification`, not on the last run's exit code.

### 3. Agent write gate
Before an agent edits code because a test failed, require:
- original failure preserved;
- unchanged-code reproduction attempted unless exception recorded;
- classification available;
- `DETERMINISTIC_FAILURE` and task relevance when the failure itself is the justification for repair.

A user-requested implementation can still proceed when tests are flaky, but the agent must not claim the flaky failure proves the requested implementation is defective.

### 4. Completion gate
For a deterministic failure-driven repair, require a post-change run file and comparison to the baseline fingerprint. A single green rerun is insufficient.

Recommended orchestrator states:

```text
OBSERVED
BASELINING
CLASSIFIED
IMPLEMENTING
MEASURING
VERIFYING
VERIFIED | BLOCKED_NONDETERMINISM | BLOCKED_INFRA | BLOCKED_UNKNOWN
```

## Repository-specific adapters
The generic classifier hashes bounded normalized stdout/stderr. For richer ecosystems, add an adapter that extracts stable test identity and assertion frames before hashing. Do not replace the raw logs.

Useful adapter fields:
- framework
- suite
- test_case
- exception_type
- assertion_message
- first_repository_stack_frame
- seed/order if available
- infrastructure marker

## CI integration
In CI, upload `artifacts/*.jsonl` and classification JSON as build artifacts. Do not automatically turn every mixed sequence into a pass. A quarantine policy should be explicit and separate from this package's evidence classification.

Suggested policy:
- changed code + deterministic failure -> fail and repair;
- unchanged code + mixed outcome -> mark nondeterministic and route to flake handling;
- infrastructure-like failure -> retry according to infra policy, bounded;
- unknown -> fail closed for autonomous completion.

## Multi-agent integration
Use distinct responsibilities from `subagents/subagents.md`. The Evidence Analyst should not modify code. The Verification Agent should not edit the candidate implementation. This keeps classification and verification from becoming rationalizations for the implementer's prior decision.

## Existing known-flake lists
Known-flake metadata is context, not an override. Still preserve the observed run. If a known flake appears unrelated to the changed code, report it separately and verify the target behavior with unaffected checks where possible.

## Resource budgets
Start with three baseline observations and three post-change observations. Increase only when failure cost and repository policy justify it. Never exceed `max_total_runs_per_decision` without explicit human/repository policy approval.

## Safety
- Do not pass secrets through test commands or save secret-bearing environment values.
- The runner captures only a conservative environment allowlist.
- Test commands can execute repository code; run them in the same sandbox/permission model already required by the coding agent.
- Do not use this package to justify disabling security checks, destructive tests, or approval boundaries.

## Rollout strategy
1. Audit historical agent sessions/CI failures and identify cases where a pass-after-rerun caused false confidence.
2. Run the classifier in observe-only mode for a week or representative task set.
3. Measure mixed-outcome frequency, run overhead, and prevented speculative edits.
4. Enable the pre-edit gate for failure-driven repairs.
5. Enable the completion gate after teams accept the classification policy.
6. Tune normalization only from observed false merges/splits; preserve raw evidence for every adjustment.
