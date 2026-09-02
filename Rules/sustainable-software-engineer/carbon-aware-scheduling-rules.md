# Carbon-Aware Scheduling Rules

## Purpose
Shift deferrable work toward lower-impact execution windows when doing so is safe and useful.

## Scope
Applies to batch jobs, model training, ETL, backups, rendering, analytics, and other time-flexible workloads.

## MUST
- Carbon-aware scheduling MUST apply only to workloads with explicit timing flexibility.
- Scheduling logic MUST respect data freshness, deadlines, recovery objectives, compliance windows, and dependency constraints.
- The carbon signal or proxy used MUST be documented and time-relevant.

## MUST NOT
- MUST NOT delay user-critical or safety-critical work without explicit product and operational approval.
- MUST NOT assume all low-demand periods have lower carbon intensity.

## SHOULD
- Prefer bounded deferral windows and deterministic fallback execution times.
- Track whether shifting actually changes emissions or merely delays work.

## Exceptions
Exceptions require the missed optimization opportunity, business constraint, and evidence that deferral would create unacceptable risk.

## Verification
Inspect scheduler policy, deadline enforcement, carbon-signal source, fallback behavior, and before/after execution telemetry.
