# Training Failure Recovery Rules

## Purpose
Recover from infrastructure and software failures without corrupting state or invalidating experimental conclusions.

## Scope
Preemption, host loss, storage errors, network failures, process crashes, OOM events, checkpoint failures, and partial restarts.

## MUST
- Recovery procedures MUST define the last trustworthy checkpoint and how data position, optimizer, scheduler, and RNG state are restored.
- Automatic restart loops MUST be bounded and MUST surface repeated failures.
- Recovery after data or checkpoint corruption MUST verify artifact integrity before resuming.
- Any resume that changes effective data order, batch size, optimizer state, or schedule MUST be recorded as an experimental discontinuity.
- High-cost training systems MUST periodically exercise recovery paths.

## MUST NOT
- MUST NOT repeatedly restart a failing job without root-cause evidence or a bounded retry policy.
- MUST NOT resume from a partially written checkpoint.
- MUST NOT hide recovery discontinuities when comparing convergence curves.

## SHOULD
- Recovery SHOULD minimize repeated data while preserving deterministic semantics where practical.
- Incident artifacts SHOULD retain enough system and model telemetry for diagnosis.

## Exceptions
Non-resumable research runs may restart from scratch if clearly identified and resource impact is accepted.

## Verification
Review retry policy, checkpoint integrity checks, recovery drills, restart metadata, data-position restoration, and post-resume loss/gradient continuity.