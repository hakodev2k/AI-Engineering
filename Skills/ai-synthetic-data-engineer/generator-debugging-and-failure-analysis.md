# Generator Debugging and Failure Analysis

## Purpose
Diagnose why a synthetic-data generator produces invalid, repetitive, biased, low-utility, contaminated, or privacy-risky outputs and identify the smallest effective correction.

## When to use
Use when quality gates fail, downstream utility drops, rare scenarios disappear, rejection rates spike, costs grow unexpectedly, or a generator behaves differently after model/configuration changes.

## Inputs
Failing samples, generation traces, prompts/configuration, model versions, seeds, validators, rejection reasons, fidelity metrics, utility results, recent changes.

## Preconditions
Representative failing and passing examples are preserved with generation metadata.

## Context to inspect
Prompt rendering, conditioning inputs, sampler settings, model routing, schema constraints, post-processing, validator logic, source-data changes, provider release notes, batch differences.

## Core knowledge
Generator symptoms often originate outside the model itself. Repetition can come from narrow conditioning; invalid output can come from schema drift; apparent fidelity loss can come from validators or source changes. Senior debugging isolates variables instead of simultaneously retuning the whole pipeline.

## Procedure
1. Define the failure precisely and quantify its rate.
2. Segment failures by scenario, model, prompt, source batch, seed, and time.
3. Reproduce a minimal failing case with fixed inputs.
4. Compare with the last-known-good configuration.
5. Inspect rendered prompts or simulator parameters rather than templates alone.
6. Separate generation defects from validator and post-processing defects.
7. Change one causal variable at a time.
8. Run paired experiments across multiple seeds.
9. Check whether the fix creates regressions in diversity, privacy, fairness, or cost.
10. Add the failure pattern to regression tests and monitoring.

## Decision points
Rollback when a recent change strongly correlates with a broad regression and a validated previous state exists. Forward-fix when rollback would reintroduce known critical defects or compatibility issues.

## Common failure patterns
Blaming the base model without evidence, tuning against a handful of examples, changing prompt and model together, ignoring validator regressions, and accepting a fix that improves fidelity while reducing diversity.

## Verification
The original failure is reproducibly reduced below threshold across representative seeds and segments, while unrelated quality gates remain stable.

## Expected output
A root-cause report, minimal corrective change, before/after metrics, and a regression test covering the failure.

## Stop conditions
Stop and escalate when the issue appears to be provider-wide, privacy-sensitive evidence cannot be accessed safely, or no controlled experiment can distinguish competing causes.