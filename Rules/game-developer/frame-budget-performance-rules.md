# Frame Budget and Performance Rules

## Purpose
Keep player-visible latency and frame delivery within explicit performance budgets.

## Scope
CPU, GPU, memory, I/O, loading, allocation, and frame pacing.

## MUST
- Target platforms MUST have explicit frame-time, memory, and loading budgets.
- Performance claims MUST include before/after measurements on representative hardware.
- Regressions on critical gameplay paths MUST be investigated before release.
- Profiling MUST identify the constrained resource before optimization work begins.

## MUST NOT
- MUST NOT optimize solely from intuition or editor-only measurements.
- MUST NOT trade correctness or safety for unmeasured micro-optimizations.

## SHOULD
- Budgets SHOULD be allocated by subsystem and tracked in CI or repeatable performance suites where practical.
- Tail frame times and stutter SHOULD be reviewed, not only averages.

## Exceptions
Budget exceptions require measured evidence, player impact assessment, and explicit acceptance by responsible owners.

## Verification
Use platform profilers, frame captures, telemetry, repeatable benchmarks, memory snapshots, and release performance gates.