# Research — Flaky Test Evidence Gate for Coding Agents

## Problem
Coding agents often treat a single failing test as proof that the implementation is wrong, or treat a single passing rerun as proof that the fix is correct. In repositories with flaky tests, unstable CI, intermittent network/dependency failures, asynchronous timing, shared fixtures, or environment-sensitive tests, both conclusions can be unsupported. The result is wasted fix/revert loops, unnecessary code changes, false completion, and weak root-cause analysis.

## Category
Thinking

## Why it matters now
Agentic coding systems increasingly run tests autonomously and make decisions from test output without a human classifying whether the signal is deterministic. Recent 2026 evidence shows flakiness remains common in CI and that one-shot code-only detection is insufficient. A recent OpenAI Codex Security issue also documents an intermittent test that failed once and then passed repeatedly, exactly the type of signal an autonomous coding agent can misinterpret.

## Current public signals

### 1. OpenAI Codex Security intermittent test report — 2026-08-04
Issue `openai/codex-security#252` reports a test that failed once in a full-suite run, then passed in isolation and in three subsequent full-suite reruns. The reporter explicitly classified it as intermittent and worth investigation rather than a deterministic regression.

Observed evidence: identical code produced different outcomes across reruns.

Source: https://github.com/openai/codex-security/issues/252

### 2. Large-scale GitHub Actions study — 2026-02-02
The paper *Understanding and Detecting Flaky Builds in GitHub Actions* analyzed reruns from 1,960 open-source Java projects. It reports that 3.2% of builds were rerun and 67.73% of those reruns exhibited flaky behavior, affecting 51.28% of the studied projects. Flaky tests, network issues, and dependency resolution were among the most prevalent categories.

Observed evidence: CI reruns frequently change outcome without source changes, and multiple non-code causes can produce failure signals.

Source: https://arxiv.org/abs/2602.02307

### 3. Limits of code-only flaky-test detection — 2026-07-10
The paper *How Far Are We from Detecting Flaky Tests? On the Limits of Code-Based Detection* found that static/code-only prediction can look strong on biased benchmarks but generalizes poorly. In its CI-mined dataset, many failures required additional execution evidence beyond source code and logs.

Observed evidence: deciding flakiness from code shape alone is often underdetermined; repeated execution and environment evidence matter.

Source: https://arxiv.org/abs/2607.09345

### 4. Reproducible flaky-test dataset — 2026-05-20
*ReproFlake* provides reproducible environments, failure-reproduction scripts, fixes, and execution logs for 1,115 flaky tests. The work emphasizes that reproducing a flaky failure is itself difficult and that execution evidence helps classify causes and validate repairs.

Source: https://arxiv.org/abs/2605.21677

### 5. LangGraph production reliability RFC
LangGraph issue `#6617` describes production reliability gaps in ReAct agents including repeated loops, mishandled errors, weak termination behavior, and the need for explicit retry classification and bounded attempts.

Interpretation for this package: test failures are another class of observations that require classification before an agent mutates code or declares completion. Blind retry and blind acceptance are both unsafe reasoning strategies.

Source: https://github.com/langchain-ai/langgraph/issues/6617

## Existing approaches
1. Rerun failed tests manually or configure CI-level reruns.
2. Quarantine tests known to be flaky.
3. Use framework retry plugins.
4. Apply static/code-based flaky-test detectors.
5. Let the coding agent inspect the first failure and attempt a fix.
6. Accept a passing full suite as sufficient verification.

## Observed limitations
- A simple rerun policy can hide deterministic defects if the agent accepts any passing retry.
- A single repeated failure can still be environmental if the environment remains broken.
- Static detection cannot reliably classify all flaky failures.
- Quarantine lists only help with previously known flakes.
- Retry plugins often report final pass/fail but do not preserve enough structured evidence for an agent to reason about mixed outcomes.
- Coding agents may modify production code before proving that the failure reproduces on unchanged code.
- A passing test after code changes does not prove causality unless the baseline behavior and failure signature are compared.

## Root-cause hypotheses
1. Test output is treated as a binary oracle rather than an observation with uncertainty.
2. Agents lack a baseline-before-change requirement.
3. Retry loops do not distinguish deterministic failure, flaky failure, infrastructure failure, and unknown failure.
4. Failure fingerprints are not normalized, so changing timestamps/paths obscure recurring signatures.
5. The agent that implements the fix is often also the sole verifier.
6. There is no explicit stop condition when evidence remains ambiguous.

## Improvement target
Introduce an evidence gate between test execution and code mutation/completion:

`Observe -> preserve baseline -> reproduce unchanged -> fingerprint outcomes -> classify signal -> decide whether code change is justified -> implement -> repeat controlled verification -> independently verify -> complete`

The gate must never silently label a mixed pass/fail sequence as fixed. It should preserve Facts, Assumptions, Failure Fingerprints, Environment Signals, Decision, Confidence, and Verification Status.

## Success metrics
- 100% of failure-driven code changes have an unchanged-code reproduction attempt or explicit reason reproduction is impossible.
- 0 cases where a single passing rerun is accepted as proof of a fix.
- Mixed pass/fail outcomes are classified as `FLAKY_OR_NONDETERMINISTIC`, not `PASS`.
- Infrastructure signatures are separated from product-test signatures when detectable.
- Retry loops are bounded by policy.
- Completion requires post-change verification plus comparison against baseline evidence.
- Rework caused by misclassified flaky failures decreases in historical replay or controlled fault-injection tests.

## Scope boundary
This package does not attempt to repair every flaky test automatically. It improves the reliability of agent decisions around test evidence and determines when an implementation change is justified, when a flake investigation is required, and when the agent must stop and escalate ambiguity.
