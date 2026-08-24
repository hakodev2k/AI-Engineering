# Control Flow Analysis Rules

## Purpose
Keep control-flow facts valid and transformations safe.

## Scope
CFG construction, dominance, loops, reachability, liveness, and data-flow analyses.

## MUST
- CFG mutations MUST update or invalidate dependent analyses.
- Dominance and reachability assumptions MUST be proven by analysis, not inferred from layout.
- Exceptional and indirect control-flow edges MUST be represented when semantically possible.
- Fixed-point analyses MUST have explicit convergence behavior.

## MUST NOT
- MUST NOT reuse stale analysis after a mutation that can invalidate it.
- MUST NOT treat unreachable code as side-effect free without language-level justification.
- MUST NOT omit control-flow edges merely because they are uncommon.

## SHOULD
- Analyses SHOULD expose conservative unknown states rather than fabricate precision.
- Incremental updates SHOULD be used only when their correctness is simpler to establish than recomputation.

## Exceptions
Specialized assumptions require documented preconditions and assertions.

## Verification
Use graph invariant checks, dominance verification, adversarial CFG tests, fuzzing, and cross-checks against reference analyses.