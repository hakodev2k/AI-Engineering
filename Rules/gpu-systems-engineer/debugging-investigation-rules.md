# GPU Debugging and Investigation Rules

## Purpose
Drive accelerator incidents and defects from evidence to bounded root cause without destructive guesswork.

## Scope
Incorrect results, hangs, crashes, OOMs, performance regressions, and intermittent GPU failures.

## MUST
- Investigations MUST capture hardware, driver/runtime, workload, precision, shape, concurrency, and error context needed for reproduction.
- Hypotheses MUST be tested against evidence before broad corrective changes.
- Asynchronous failures MUST be localized with appropriate synchronization or diagnostic tooling in controlled environments.
- Minimal reproducers SHOULD be created when they materially reduce ambiguity.
- Production evidence MUST be preserved before resets when feasible and safe.

## MUST NOT
- MUST NOT treat agent confidence or a single correlation as root-cause proof.
- MUST NOT enable unsafe debug settings in production without approval.
- MUST NOT discard hardware-health evidence after a process-level symptom disappears.

## SHOULD
- Compare known-good and failing devices/configurations systematically.
- Reduce variables one at a time when practical.

## Exceptions
Emergency mitigation may precede root-cause completion, but the unresolved cause and follow-up owner must be recorded.

## Verification
Review repro steps, profiler/debugger output, health logs, hypothesis tests, and corrective-change evidence.