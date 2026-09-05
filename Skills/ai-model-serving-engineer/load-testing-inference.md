# Inference Load Testing

## Purpose
Build representative load tests that reveal real serving bottlenecks, queueing limits, failure modes, and SLO boundaries before production traffic does.

## When to use
Use before launches, hardware/runtime changes, model upgrades, autoscaling changes, and after major performance incidents.

## Inputs
Traffic distributions, prompt/output lengths, concurrency, streaming behavior, priority classes, SLOs, deployment topology, and target model.

## Preconditions
A safe test environment or controlled production test path exists.

## Context to inspect
Traffic generator, rate/concurrency model, dataset realism, connection reuse, streaming clients, retries, autoscaling, monitoring, and provider/rate limits.

## Core knowledge
Closed-loop concurrency tests and open-loop arrival-rate tests answer different questions. AI traffic must represent token distributions and generation lengths; tiny synthetic prompts produce misleading results.

## Procedure
1. Derive workload distributions from expected or historical traffic.
2. Include short, median, long, and pathological contexts.
3. Test streaming and non-streaming separately when relevant.
4. Run steady-state, ramp, burst, and overload phases.
5. Measure queue, TTFT, inter-token latency, end-to-end latency, throughput, errors, memory, and utilization.
6. Validate autoscaling and admission behavior.
7. Repeat long enough to expose leaks and thermal/fragmentation effects.
8. Locate the knee where latency grows nonlinearly.
9. Document safe operating envelope.

## Decision points
Prefer open-loop arrival-rate testing for overload realism and closed-loop testing for controlled concurrency characterization.

## Common failure patterns
Uniform tiny prompts, short test duration, ignoring client retry behavior, and reporting only average latency.

## Verification
Results are reproducible and explain observed resource saturation and tail-latency behavior.

## Expected output
A load-test report with safe capacity, saturation point, bottlenecks, and scaling recommendations.

## Stop conditions
Abort tests that risk shared production stability, uncontrolled cost, or external provider limits.