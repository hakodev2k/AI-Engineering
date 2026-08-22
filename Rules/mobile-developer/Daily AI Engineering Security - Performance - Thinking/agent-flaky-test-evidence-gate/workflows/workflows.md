# Workflows

## Workflow A — Failure-Driven Change Gate

**Trigger:** a test/build/verification failure appears during an agent task.

**Goal:** determine whether the failure justifies code changes before the agent enters a fix loop.

**Inputs:** failing command/output, task requirements, repository revision/diff, policy.

**Baseline:** the first observed run plus repeated unchanged-code runs.

**Context:** known flakes, relevant environment data, test ownership, current task diff.

**Stages:**
1. **Observe** — Failure Evidence Analyst records first failure and raw evidence.
2. **Freeze baseline** — capture revision and diff hash; prohibit failure-driven code mutation.
3. **Reproduce unchanged** — execute up to `baseline_runs` with identical command/environment where practical.
4. **Fingerprint** — deterministic script normalizes logs and groups failures.
5. **Classify** — choose `CONSISTENT_PASS`, `DETERMINISTIC_FAILURE`, `FLAKY_OR_NONDETERMINISTIC`, `LIKELY_INFRASTRUCTURE`, or `UNKNOWN`.
6. **Decision checkpoint**:
   - deterministic + task-relevant -> implementation hypothesis;
   - nondeterministic -> Flake Investigator;
   - infrastructure -> stop product-code repair and route appropriately;
   - unknown -> one evidence-expansion cycle only if budget remains;
   - consistent pass after original failure -> still nondeterministic evidence, not clean baseline.
7. **Handoff** — produce structured evidence package.

**Responsible agent:** Failure Evidence Analyst; Flake Investigator when required.

**Tools:** repeated runner, classifier, version-control status, test framework.

**Outputs:** baseline JSONL, classification, fingerprint summary, next action.

**Checkpoints:** revision unchanged; rerun count bounded; raw failed logs retained.

**Metrics:** reproduction rate, unique failure fingerprints, pass/fail mix, time spent before speculative code change.

**Retry policy:** at most one additional evidence-expansion cycle and never above `max_total_runs_per_decision`.

**Stop conditions:** stable classification; budget exhausted; unsafe/destructive reproduction; environment unavailable.

**Failure path:** mark `UNKNOWN`, preserve evidence, escalate rather than guess.

**Verification:** classification script and independent reviewer agree with raw records.

**Definition of Done:** failure is classified with evidence and a permitted next action is selected.

---

## Workflow B — Deterministic Fix and Causal Verification

**Trigger:** Workflow A yields a deterministic, task-relevant failure.

**Goal:** fix the defect and demonstrate that the targeted failure signature no longer reproduces while relevant regressions remain absent.

**Inputs:** baseline evidence/fingerprint, implementation hypothesis, acceptance criteria.

**Baseline:** deterministic failure rate and dominant fingerprint before change.

**Context:** target code, related tests, regression scope.

**Stages:**
1. **Hypothesis** — Implementation Agent states a falsifiable cause and expected effect.
2. **Implement** — make minimum change; do not modify unrelated flaky tests.
3. **Static checkpoint** — compile/lint/static analysis as applicable.
4. **Target measure** — run targeted test `post_change_runs` times.
5. **Compare** — classifier compares post-change outcomes with baseline fingerprint.
6. **Broader verification** — run relevant suite once or per repository policy.
7. **Independent review** — Verification Agent checks raw records and diff.
8. **Decision**:
   - target fingerprint gone, bounded runs pass, broader checks pass -> verified;
   - target fingerprint persists -> one diagnosis/implementation retry;
   - mixed/new fingerprints -> reclassify; do not declare fixed;
   - infra/unknown -> stop with evidence.

**Responsible agent:** Implementation Agent then Verification Agent.

**Tools:** compiler, test runner, repeated runner, classifier, diff inspection.

**Outputs:** implementation diff, post-change JSONL, comparison, final statuses.

**Checkpoints:** implementation frozen during verification; no skipped failures; verifier independent.

**Metrics:** baseline vs post-change failure rate, fingerprint recurrence, regression count, total reruns, rework count.

**Retry policy:** maximum one implementation retry unless repository policy is stricter.

**Stop conditions:** verified; regression; repeated target failure; ambiguity after retry; run budget exhausted.

**Failure path:** restore diagnostic state, preserve all runs, report blocking classification.

**Verification:** independent evidence review.

**Definition of Done:** `Implemented=true`, metrics captured, `Verified=true`, no target fingerprint recurrence in configured verification runs, relevant suite accepted.

---

## Workflow C — Flake Investigation Without Scope Pollution

**Trigger:** mixed outcomes or changing failure fingerprints on unchanged code.

**Goal:** identify nondeterminism cause or isolate it without corrupting the requested change.

**Inputs:** run records, fingerprints, environment, test identity.

**Baseline:** mixed outcome rate and failure-signature distribution.

**Context:** execution order, concurrency, random seed, timezone/locale, dependencies, network, temp/shared state.

**Stages:**
1. Extract ranked hypotheses from observable evidence.
2. Run smallest controlled experiment for the top hypothesis.
3. Change one variable at a time when practical.
4. Compare distributions/fingerprints.
5. Repeat for at most three hypotheses or until total run budget is exhausted.
6. If cause is identified, create a narrow remediation/owner recommendation.
7. If unresolved, explicitly mark unresolved nondeterminism; do not make unrelated product changes.

**Responsible agent:** Flake Investigator.

**Tools:** isolated/repeated test execution, environment inspection, classifier.

**Outputs:** hypotheses, experiment records, cause confidence, recommended action.

**Checkpoints:** unchanged code unless a specific flake fix is being tested; one variable per experiment where feasible.

**Metrics:** flake rate, signature entropy, hypothesis evidence score, runs consumed.

**Retry policy:** maximum three hypothesis experiments and global run budget enforced.

**Stop conditions:** supported cause; budget exhausted; external dependency blocks investigation.

**Failure path:** escalate unresolved flake with evidence.

**Verification:** reproduce the proposed flake fix/control condition before marking resolved.

**Definition of Done:** nondeterminism is causally explained and verified, or explicitly unresolved without contaminating the original task decision.
