# Edge AI Inference

## Purpose
Deploy and operate machine-learning inference at the edge under latency, compute, memory, power, privacy, and update constraints.

## When to use
Use when models must run near sensors or users for low latency, privacy, bandwidth reduction, or disconnected operation.

## Inputs
Model artifact, accuracy target, latency target, hardware accelerators, input characteristics, update cadence.

## Context to inspect
Inspect model format, preprocessing, runtime libraries, accelerator drivers, memory footprint, thermal limits, and cloud fallback.

## Core knowledge
Senior edge inference work balances model quality against quantization, pruning, batching, hardware compatibility, cold-start cost, power, thermal throttling, and model-version governance.

## Procedure
1. Establish end-to-end latency and quality baselines.
2. Profile preprocessing, inference, and postprocessing separately.
3. Select runtime and accelerator path supported by target hardware.
4. Optimize model precision or size only against measured quality impact.
5. Bound concurrency and memory use.
6. Define fallback behavior for unavailable models or accelerators.
7. Version models with preprocessing contracts.
8. Stage model rollout independently where practical.
9. Monitor latency, failures, resource use, and quality proxies.
10. Test representative real-world inputs and thermal steady state.

## Decision points
Use local inference when latency, privacy, autonomy, or bandwidth benefits justify operational complexity. Use cloud inference when global models and elastic compute dominate.

## Common failure patterns
Benchmarking only model execution, mismatched preprocessing, unsupported operators, thermal throttling, silent model drift, no rollback.

## Verification
Measure end-to-end latency, accuracy, memory, power/thermal behavior, startup, failure fallback, and model rollback on representative devices.

## Expected output
A validated edge-inference deployment with model/runtime compatibility, resource budget, rollout, observability, and fallback rules.

## Stop conditions
Stop when required accuracy and latency cannot coexist within target hardware limits.