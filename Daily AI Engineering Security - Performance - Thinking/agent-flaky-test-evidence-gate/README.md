# Agent Flaky Test Evidence Gate

## Topic
Evidence-gated test failure reasoning for autonomous coding agents.

## Category
**Thinking**

## Problem
Autonomous coding agents frequently use test outcomes as decision inputs. A single failure can trigger unnecessary repairs, while a single passing rerun can create false confidence. In real CI environments, the same unchanged revision may alternate between pass and fail because of timing, concurrency, environment, dependency/network instability, shared state, randomness, or test-order effects.

The engineering problem is not simply “flaky tests exist.” It is that agent decision loops often lack a reliable boundary between **observing a failure** and **concluding what caused it**. Without that boundary, the agent can make unsupported causal claims, enter repeated test-fix loops, weaken tests, or declare completion from insufficient evidence.

## Evidence
The package is grounded in current 2026 public evidence documented in `evidence/research.md`:
- OpenAI Codex Security issue #252 reports a test that failed once then passed on repeated unchanged-code reruns.
- A large-scale GitHub Actions study reports substantial flaky behavior among rerun builds.
- A July 2026 study shows code-only flakiness detection is often insufficient and execution evidence is necessary.
- ReproFlake provides execution-based reproduction evidence for more than a thousand flaky tests.
- LangGraph production-reliability discussions document the need for explicit error classification and bounded retry behavior in agent loops.

## Existing approach
Common approaches include CI rerun plugins, manual retries, known-flake quarantine lists, static flaky-test detectors, and coding agents that simply inspect the latest test output.

## Existing limitations
- Retry-until-pass can hide a deterministic defect.
- One rerun cannot prove either flakiness or a fix.
- Static source inspection cannot classify all nondeterministic failures.
- Known-flake lists do not cover new flakes.
- Generic retry tooling often preserves only the final status rather than structured evidence for causal comparison.
- Agent self-verification can rationalize its own implementation decision.

## Proposed improvement
Insert an evidence gate before failure-driven code mutation and before final completion:

```text
Observe
  -> preserve first failure
  -> freeze revision/diff baseline
  -> reproduce unchanged code within a bounded budget
  -> normalize + fingerprint observations
  -> classify evidence
  -> choose deterministic repair / flake investigation / infra handling / stop
  -> implement only when justified
  -> collect post-change repeated evidence
  -> compare against baseline fingerprint
  -> independent verification
  -> complete or stop
```

The package never asks for hidden chain-of-thought. It requires explicit engineering artifacts: Facts, Assumptions, Evidence, Failure Fingerprints, Classification, Decision, Risks, Metrics, and Verification Status.

## Architecture

### Evidence layer
`scripts/run_repeated_command.py` records repeated command observations as JSONL without discarding failures.

### Classification layer
`scripts/classify_test_signal.py` compares pass/fail distribution, normalized failure fingerprints, timeout state, and infrastructure markers. Its supported classifications are:
- `CONSISTENT_PASS`
- `DETERMINISTIC_FAILURE`
- `FLAKY_OR_NONDETERMINISTIC`
- `LIKELY_INFRASTRUCTURE`
- `UNKNOWN`

### Policy layer
`config/policy.json` defines bounded baseline/post-change runs, timeouts, normalization intent, infrastructure markers, and fail-closed behavior.

### Reasoning layer
`skills/core-skills.md`, `rules/engineering-rules.md`, and `workflows/workflows.md` define how agents must use the evidence rather than treating the latest exit code as an oracle.

### Delegation layer
`subagents/subagents.md` separates evidence analysis, implementation, flake investigation, and independent verification.

### Enforcement layer
`hooks/hooks.md` defines pre-edit, baseline, post-change, and final completion gates.

## Package structure

```text
agent-flaky-test-evidence-gate/
├── README.md
├── guide-intergration.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── skills/
│   └── core-skills.md
├── rules/
│   └── engineering-rules.md
├── subagents/
│   └── subagents.md
├── workflows/
│   └── workflows.md
├── hooks/
│   └── hooks.md
├── scripts/
│   ├── run_repeated_command.py
│   └── classify_test_signal.py
├── tests/
│   └── test_classifier.py
└── verification/
    └── report.md
```

## Installation
Requirements:
- Python 3.10+
- the repository's normal test/build toolchain
- a sandbox/permission model appropriate for executing repository tests

No third-party Python package is required by the included scripts.

Copy the package into the agent/orchestrator repository or reference its scripts/config from a shared tooling location.

## Configuration
Edit `config/policy.json` only from measured repository behavior.

Default policy:
- 3 unchanged-code baseline observations;
- 3 post-change observations;
- maximum 8 observations per decision;
- 600-second per-run timeout;
- mixed pass/fail always remains nondeterministic;
- single passing rerun is never accepted as proof of a fix;
- unknown evidence blocks autonomous completion;
- independent verification is required.

Do not increase retry budgets merely to obtain a passing run.

## Usage

### Capture baseline evidence

```bash
python scripts/run_repeated_command.py \
  --runs 3 \
  --timeout 600 \
  --output artifacts/baseline-runs.jsonl \
  -- dotnet test tests/MyProject.Tests --filter FullyQualifiedName~TargetTest
```

### Classify baseline

```bash
python scripts/classify_test_signal.py \
  --input artifacts/baseline-runs.jsonl \
  --policy config/policy.json \
  --json-output artifacts/baseline-classification.json
```

### Interpret the result
- `DETERMINISTIC_FAILURE`: form a task-relevant causal hypothesis before editing.
- `FLAKY_OR_NONDETERMINISTIC`: investigate nondeterminism; do not repair unrelated production code from this evidence.
- `LIKELY_INFRASTRUCTURE`: route to bounded infrastructure handling.
- `UNKNOWN`: stop or collect one bounded evidence-expansion cycle.
- `CONSISTENT_PASS`: if this follows an earlier failure, the full evidence set is still nondeterministic; do not erase the initial failure.

### Verify after change
Repeat the targeted verification into a separate post-change JSONL file and compare it with the recorded baseline fingerprint. The implementation is not `Verified` merely because one run passes.

## Workflow
Use `workflows/workflows.md` for three operational flows:
- failure-driven change gate;
- deterministic fix + causal verification;
- bounded flake investigation.

Every loop has a maximum retry/run budget and an explicit stop condition.

## Metrics
Collect at minimum:
- baseline pass/fail distribution;
- unique normalized failure fingerprints;
- dominant fingerprint ratio;
- infrastructure marker count;
- runs consumed per decision;
- target fingerprint recurrence after change;
- broader regression count;
- speculative edits avoided;
- failure-driven rework loops.

For rollout evaluation, compare completion accuracy and rework before/after enabling the gate.

## Verification
See `verification/report.md`.

Status meanings:
- **Implemented:** package/procedure exists.
- **Measured:** real baseline/post-change observations have been collected.
- **Verified:** evidence supports the completion claim and required independent verification is complete.

The package does not label repository-specific behavior verified until actual test evidence exists.

## Safety
- Test execution can run repository code; keep the same sandbox and permission controls used by the coding agent.
- Do not store secrets in commands, logs, or environment metadata.
- The runner captures only a conservative environment allowlist.
- Do not disable, skip, delete, or weaken tests simply to reach green status.
- Do not convert network/dependency/timeouts into product-code defects without evidence.
- Preserve raw observations; normalization is for comparison, not evidence destruction.
- Respect human approval requirements for destructive or expensive test environments.

## Failure handling
- Runner/internal I/O failure -> stop automated repair and preserve the error.
- Malformed evidence -> classifier returns invalid-input status; do not guess.
- Mixed outcomes -> nondeterministic classification.
- Repeated infrastructure markers -> infrastructure classification, still subject to investigation.
- Unknown after bounded expansion -> stop and escalate.
- Target fingerprint persists after one implementation retry -> stop the fix loop and return to root-cause analysis.
- New post-change fingerprint -> classify as a new observation rather than hiding it behind overall green status.

## Definition of Done
A failure-driven agent task using this package is done only when:
1. public/problem evidence and local failure evidence are documented as applicable;
2. initial failure and working-tree baseline are preserved;
3. unchanged-code reproduction is attempted or exception recorded;
4. evidence classification exists;
5. any implementation change is tied to a falsifiable hypothesis;
6. bounded retry/run budgets are respected;
7. post-change targeted metrics are collected;
8. target baseline fingerprint is compared with post-change evidence;
9. relevant broader verification completes;
10. required independent verification completes;
11. no unresolved target nondeterminism/infrastructure/unknown state is hidden;
12. final status distinguishes Implemented, Measured, and Verified.

## Customization
Safe customization points:
- repository-specific test-result parser before fingerprinting;
- additional infrastructure markers;
- stricter run/timeout budgets;
- repository-specific known-flake metadata;
- full-suite verification policy;
- artifact storage path;
- CI adapter that uploads JSONL and classification results.

Do not customize away the core invariants: preserve all observations, baseline before failure-driven repair, mixed outcomes never become clean pass, bounded loops, explicit uncertainty, and independent verification when required.
