# Skill — Effective Threshold Attestation

## Purpose
Prove the compaction threshold that the runtime will actually enforce and compare it with configured token-budget intent.

## Trigger
Session start/resume, model or provider switch, configuration reload, compactor reinitialization, or observed context-window change.

## Inputs
Configured threshold ratio/tokens, observed effective context window, observed effective threshold tokens, approved divergence tolerance, optional absolute ceiling.

## Preconditions
The host exposes or can safely measure effective runtime context and compressor threshold without consuming model tokens unnecessarily.

## Required context
Model/provider identity, configuration precedence, runtime overrides, rate-limit/cost SLOs.

## Allowed tools
Read-only config/status inspection, telemetry, `scripts/attest_compaction_threshold.py`, test runner.

## Constraints
Do not force compaction solely to observe it in production. Never discard context required for correctness.

## Procedure
1. Record configured ratio and absolute-token settings separately from runtime state.
2. Resolve the actual model/provider/session identity.
3. Read or safely derive the effective runtime context window.
4. Read the threshold used by the active compactor, after all floors, ceilings, and overrides.
5. Compute effective ratio = threshold tokens / effective context tokens.
6. Compare against configured intent and approved tolerance.
7. Apply the absolute token ceiling when configured.
8. Attach a reason code for every deviation (floor, provider clamp, metadata fallback, override, unknown).
9. Capture baseline tokens/task, latency and compaction frequency before tuning.
10. After tuning, re-attest and compare metrics; verify result quality did not regress.

## Decision points
Unexplained divergence: block compliance claim. Explained approved divergence: warn/pass according to policy. Absolute ceiling violation: block. Exact/within-tolerance state: pass.

## Expected output
Machine-readable effective-context and threshold attestation plus PASS/WARN/BLOCK.

## Metrics
Ratio delta, threshold tokens, tokens/task, latency, compactions/session, rate-limit incidents, quality regression rate.

## Verification
Use fixtures representing exact match, silent 60%→75% clamp, oversized 500K threshold, and changed effective context.

## Failure handling
One bounded refresh of runtime state is allowed. If still inconsistent, stop and escalate rather than guessing.

## Stop conditions
Verified attestation or unresolved state marked BLOCK.
