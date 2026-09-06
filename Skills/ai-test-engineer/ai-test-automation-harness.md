# AI Test Automation Harness

## Purpose
Design and maintain a reusable automated test harness for AI applications that can run deterministic tests, model evaluations, repeated stochastic trials, graders, traces, and regression comparisons in CI and scheduled environments.

## When to use
Use when AI evaluation has grown beyond ad hoc scripts or manual notebooks and must become repeatable release infrastructure.

## Inputs
Repository, test cases, evaluator definitions, model/provider clients, prompts, fixtures, secrets strategy, CI environment, thresholds, and reporting requirements.

## Preconditions
Core evaluation criteria are already defined; the harness should automate a known testing strategy rather than invent product quality goals.

## Context to inspect
Inspect existing test frameworks, CI pipelines, model abstractions, configuration management, test datasets, caching, telemetry, secret handling, and artifact retention.

## Core knowledge
An AI harness must preserve reproducibility metadata while accepting probabilistic outputs. It should support deterministic assertions, score-based graders, repeated trials, category aggregation, baseline comparison, selective reruns, concurrency control, and cost limits. Test code itself must be reviewed and versioned.

## Procedure
1. Define a stable test-case schema containing input, metadata, expected invariants, and evaluator configuration.
2. Define adapters for models or AI-system endpoints without leaking provider details into test cases.
3. Capture model, prompt, retrieval/data, tool, and evaluator versions for every run.
4. Implement deterministic assertions separately from probabilistic graders.
5. Add bounded retries only for infrastructure failures, never to hide behavioral failures.
6. Support repeated trials for stochastic metrics and aggregate distributions.
7. Add concurrency limits, rate-limit handling, timeouts, and cost budgets.
8. Persist per-case results, traces, scores, errors, and summary artifacts.
9. Implement baseline-versus-candidate comparison and category-level gates.
10. Integrate fast protected tests into pull-request CI and broader suites into appropriate release workflows.
11. Make failures reproducible through case IDs and pinned configuration.
12. Review harness reliability with seeded known-pass and known-fail cases.

## Decision points
Run small deterministic suites on every change and larger probabilistic suites where latency/cost allow. Cache only immutable inference/evaluation results with configuration-aware keys. Separate infrastructure flakes from genuine behavioral variance.

## Common failure patterns
Unversioned test inputs, mutable golden data, silently rerunning failed evaluations until they pass, provider-specific test logic everywhere, no cost guardrails, and summaries that hide individual severe failures.

## Verification
Use known-pass and known-fail fixtures to prove the harness catches intended regressions. Verify identical pinned inputs/configurations produce traceable comparable runs and CI gates fail when thresholds are deliberately violated.

## Expected output
A maintainable AI test harness with versioned case schema, evaluators, execution controls, result artifacts, baseline comparison, and CI release gates.

## Stop conditions
Stop when required secrets cannot be supplied safely, evaluation criteria are undefined, or CI execution could create uncontrolled cost or external side effects.