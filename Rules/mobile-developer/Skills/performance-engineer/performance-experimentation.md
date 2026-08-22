# Performance Experimentation and Trade-off Analysis

## Purpose
Run disciplined experiments that compare performance alternatives while accounting for correctness, maintainability, reliability, and cost.

## When to use
Use when several plausible optimizations or architecture choices exist and intuition alone cannot establish the best option.

## Inputs
Hypotheses, candidate changes, workload model, baseline, target metrics, constraints, and experiment environment.

## Context to inspect
Inspect user impact, critical path, resource bottleneck, implementation complexity, operational consequences, failure modes, and environment variance.

## Core knowledge
Optimization is empirical. Define hypotheses before measurement, isolate variables, preserve raw evidence, and evaluate practical effect size rather than chasing statistically detectable but irrelevant differences.

## Procedure
1. State the bottleneck and causal hypothesis.
2. Define primary and guardrail metrics.
3. Establish a reproducible baseline.
4. Rank candidate interventions by expected impact and cost.
5. Test the smallest intervention that discriminates the hypothesis.
6. Control environment and workload variables.
7. Repeat measurements and quantify variance.
8. Evaluate latency, throughput, resources, errors, cost, and complexity.
9. Reject changes whose benefit does not justify their operational/maintenance cost.
10. Record the decision, evidence, limitations, and rollback path.

## Decision points
Prefer simple changes with broad measured impact. Accept complexity only when the sustained benefit is material and the team can operate it safely.

## Common failure patterns
Benchmarking after deciding the answer, cherry-picking runs, changing multiple variables, ignoring guardrail regressions, optimizing synthetic workloads, and keeping complex optimizations after their bottleneck disappears.

## Verification
Independent reruns under equivalent conditions should support the same practical conclusion and guardrail metrics must remain acceptable.

## Expected output
A documented performance decision with reproducible evidence and explicit trade-offs.

## Stop conditions
Stop when the experiment cannot isolate the variable or the proposed change requires risk approval before testing.