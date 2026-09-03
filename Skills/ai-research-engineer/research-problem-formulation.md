# Research Problem Formulation

## Purpose
Convert an ambiguous AI idea into a falsifiable research problem with explicit hypotheses, constraints, success criteria, and decision value. This skill prevents expensive experimentation on questions that are vague, unmeasurable, or disconnected from a real capability gap.

## When to use
Use at the start of a research initiative, when a prototype has unclear goals, when stakeholders request a new model capability, or when an existing line of work is producing activity without decisive evidence. Do not use this skill as a substitute for implementation planning after the research question is already stable.

## Inputs
- Research idea or capability request
- Known system limitations
- Representative data or task examples
- Candidate metrics
- Compute, data, timeline, privacy, and safety constraints
- Prior internal or external evidence

## Preconditions
Identify the decision the research should enable. Separate the scientific question from implementation preferences such as a specific architecture, framework, vendor, or model family.

## Context to inspect
Inspect current baselines, known failure modes, available datasets, prior experiments, production constraints, evaluation infrastructure, relevant literature, and downstream consumers. Confirm whether the problem is capability-limited, data-limited, optimization-limited, evaluation-limited, or operationally constrained.

## Core knowledge
Strong research questions are falsifiable, scoped, and linked to measurable evidence. A Senior researcher distinguishes observations from hypotheses and separates primary outcomes from supporting diagnostics. Good problem formulation includes a null hypothesis or clear baseline expectation, a bounded intervention, known confounders, and an explicit decision rule for continuing, changing direction, or stopping.

## Procedure
1. State the observed limitation in concrete terms.
2. Define the target task and affected user or system behavior.
3. Identify the strongest existing baseline.
4. Write one primary hypothesis in falsifiable form.
5. Add secondary hypotheses only when they can be tested without obscuring the primary question.
6. Define the intervention or independent variable.
7. Define primary metrics and minimum meaningful improvement.
8. Define guardrail metrics such as latency, cost, safety, calibration, or robustness.
9. List likely confounders and how they will be controlled.
10. Specify the evaluation population and important slices.
11. Estimate the minimum experiment needed to distinguish signal from noise.
12. Define explicit success, inconclusive, and failure outcomes.
13. Record what decision follows from each outcome.
14. Review whether the question can be answered with existing evidence before launching new experiments.

## Decision points
- Narrow the scope when multiple mechanisms are changing simultaneously.
- Prefer a direct behavioral metric over a proxy when feasible.
- Use exploratory experiments when uncertainty is structural; use confirmatory experiments when a specific claim must be validated.
- Reject research questions whose expected improvement has no practical decision value.

## Common failure patterns
- Starting with a favorite architecture rather than a problem.
- Using vague objectives such as “make the model smarter.”
- Selecting metrics after seeing results.
- Comparing against weak or outdated baselines.
- Combining several hypotheses into one experiment.
- Ignoring compute or inference cost in capability claims.
- Treating a statistically detectable effect as practically meaningful.

## Verification
The problem is formulated when the hypothesis, baseline, intervention, metrics, slices, constraints, and decision rules are documented. It is verified only when another experienced researcher can independently describe what evidence would support or refute the claim without asking for hidden assumptions.

## Expected output
A concise research problem statement containing the observed gap, hypothesis, baseline, intervention, metrics, guardrails, confounders, evaluation scope, constraints, and decision rules.

## Stop conditions
Stop and escalate when the desired capability cannot be measured, no credible baseline exists, required data cannot be legally or ethically used, expected value does not justify experiment cost, or safety constraints make the proposed intervention unacceptable.