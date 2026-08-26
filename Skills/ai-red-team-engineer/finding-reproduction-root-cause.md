# Red-Team Finding Reproduction and Root Cause

## Purpose
Turn an observed AI failure into a minimal, evidence-backed root cause that engineering can fix and verify.

## When to use
Use after discovering a suspected vulnerability, policy bypass, leakage, unsafe action, or unexplained adversarial behavior.

## Inputs
Original transcript, model/version, prompts, configuration, logs, traces, tool calls, retrieval results, and environment metadata.

## Context to inspect
Reconstruct the exact request path, prompt assembly, retrieved context, policy layers, tool authorization, and downstream execution.

## Core knowledge
AI failures may be stochastic and multi-layered. Root cause can lie in model behavior, orchestration, authorization, retrieval, parser logic, caching, configuration, or policy ambiguity.

## Procedure
1. Preserve original evidence immutably.
2. Reproduce with the same model and configuration.
3. Repeat enough times to estimate reliability.
4. Minimize the attack while preserving failure.
5. Remove components one at a time to localize the responsible layer.
6. Compare against benign and negative controls.
7. Trace data and actions through system boundaries.
8. Form a falsifiable root-cause hypothesis.
9. Validate the hypothesis with a targeted experiment.
10. Define a regression test before remediation.

## Decision points
Treat intermittent critical failures as real when evidence shows a credible attack path; do not demand deterministic reproduction for stochastic systems.

## Common failure patterns
Editing the prompt before preserving evidence; blaming the base model without tracing orchestration; no control experiments; confusing correlation with root cause.

## Verification
A root cause is verified when a targeted change predictably changes the failure while controls behave as expected.

## Expected output
A minimal reproduction, failure-rate estimate, root-cause analysis, and regression test.

## Stop conditions
Stop when reproduction risks uncontrolled side effects or required production evidence cannot be safely accessed; escalate with preserved artifacts.