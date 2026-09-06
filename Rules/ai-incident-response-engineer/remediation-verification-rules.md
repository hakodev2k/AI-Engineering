# Remediation Verification Rules

## Purpose
Require evidence that incident fixes work, do not create unacceptable regressions, and address the causal failure.

## Scope
Applies to code, model, prompt, policy, data, infrastructure, access, and process remediation.

## MUST
- Each material remediation MUST map to a demonstrated cause, contributing factor, detection gap, or containment weakness.
- Verification MUST test the original failure condition where safely reproducible.
- High-risk fixes MUST include negative tests and regression checks for security, safety, privacy, reliability, and compatibility as relevant.
- Performance-related fixes MUST use before/after measurement under comparable conditions.
- Production remediation MUST be observed long enough to establish that triggering signals and impact have returned to acceptable levels.
- Residual known failure modes MUST be documented with owner and risk disposition.

## MUST NOT
- Incident closure MUST NOT rely solely on deployment success.
- Responders MUST NOT claim a performance, security, or safety improvement without supporting evidence.
- Remediation MUST NOT be considered complete while required verification is knowingly failing.

## SHOULD
- Prefer automated regression tests for repeatable failure classes.
- Validate both correctness and operational behavior under representative load or traffic when relevant.

## Exceptions
If direct verification is impossible, closure requires documented alternative evidence and explicit residual-risk acceptance.

## Verification
Inspect remediation-to-cause mapping, tests, evaluation results, benchmarks, production telemetry, and risk acceptance records.