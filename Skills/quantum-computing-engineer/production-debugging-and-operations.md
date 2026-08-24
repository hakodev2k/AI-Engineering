# Production Debugging and Operations

## Purpose
Diagnose failures in production or shared quantum workloads by separating application defects, orchestration faults, compiler changes, backend drift, statistical variation, and hardware noise.

## When to use
Use for failed jobs, degraded result quality, latency spikes, provider incidents, unexpected optimizer behavior, or regressions after SDK/backend changes.

## Inputs
Incident description, logical/transpiled circuits, job IDs, logs, raw counts, backend metadata, calibration snapshots, source revision, provider status, and baseline runs.

## Preconditions
Relevant run metadata and raw evidence are available. Destructive reruns or production changes require normal approval controls.

## Context to inspect
Submission and polling state, retries, timeouts, provider responses, queue duration, compiler/transpiler versions, qubit mapping, calibration window, shots, seeds, optimizer state, and post-processing.

## Core knowledge
A wrong quantum result is not automatically a hardware failure. Senior diagnosis works from reproducible evidence and progressively isolates layers: deterministic classical code, logical circuit, transpilation, sampling, hardware, and post-processing.

## Procedure
1. Preserve raw incident artifacts before rerunning.
2. Establish the last known-good workload and environment.
3. Reproduce deterministic preprocessing and circuit generation locally.
4. Run the same logical circuit on an exact/noiseless simulator where tractable.
5. Compare logical and transpiled circuit semantics and resource metrics.
6. Review backend calibration and mapping changes around the incident window.
7. Distinguish queue/API failures from completed-but-low-quality runs.
8. Re-run a minimal diagnostic circuit on affected and alternative qubits/backends when safe.
9. Quantify whether observed differences exceed expected shot variance.
10. Inspect optimizer checkpoints and post-processing for state corruption.
11. Mitigate using rollback, remapping, fallback backend, increased evidence, or classical fallback as appropriate.
12. Add regression tests and operational telemetry for the confirmed failure mode.

## Decision points
Use simulator reproduction first for semantic defects; use alternative hardware/mapping when evidence points to backend quality; fail over to classical execution when reliability matters more than preserving a quantum path.

## Common failure patterns
Blind retries, discarding failed-job metadata, attributing all variance to noise, comparing different calibration windows, and changing circuits before preserving the failing artifact.

## Verification
Confirm the root cause with a controlled reproduction or strong comparative evidence, then verify the mitigation restores agreed quality and operational metrics.

## Expected output
Incident timeline, evidence, root cause or bounded hypothesis, mitigation, verification results, residual risk, and regression protection.

## Stop conditions
Stop and escalate when provider behavior cannot be independently verified, production credentials/permissions are insufficient, or continued experiments risk unacceptable cost or service impact.