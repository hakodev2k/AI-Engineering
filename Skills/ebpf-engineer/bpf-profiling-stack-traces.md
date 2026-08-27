# eBPF Profiling and Stack Traces

## Purpose
Collect statistically sound CPU or event-triggered stack profiles with bounded overhead and correct symbolization.

## When to use
Use for performance investigations, flame graphs, off-CPU analysis, or hotspot attribution.

## Inputs
Profiling question, target processes, sampling rate, kernel/user stacks, symbols, duration, overhead budget.

## Context to inspect
Inspect stack-map limits, frame pointers/unwindability, symbol sources, namespaces, build IDs, JIT runtimes, and sampling hook.

## Core knowledge
Profiles are samples, not exact accounting. Symbolization quality and unwind strategy determine usefulness. Higher sample rates improve resolution but increase overhead and map pressure.

## Procedure
1. State the hypothesis and population to profile.
2. Choose event/sample source appropriate to the question.
3. Set conservative sampling rate and duration.
4. Capture user/kernel stack IDs with required identity metadata.
5. Aggregate counts in kernel where practical.
6. Symbolize using matching build IDs and kernel symbols.
7. Quantify missing stacks and map failures.
8. Compare against baseline or control period.
9. Repeat to confirm stable hotspots.

## Decision points
Use frame-pointer unwinding when reliable; use alternative unwind strategies only with measured need. Prefer aggregation over emitting every sample.

## Common failure patterns
Treating samples as exact time, mismatched symbols, ignoring failed stack captures, over-high sampling, and mixing container identities.

## Verification
Known synthetic workloads should produce expected hotspots; measure profiler overhead and unresolved-stack rate.

## Expected output
A reproducible profile with sampling assumptions, symbol quality, and quantified uncertainty.

## Stop conditions
Stop when unwind quality or overhead makes conclusions unreliable.