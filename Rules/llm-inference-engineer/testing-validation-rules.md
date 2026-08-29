# Testing and Validation Rules

## Purpose
Ensure inference changes are validated for correctness, compatibility, performance, and failure behavior before production exposure.

## Scope
Applies to model servers, runtimes, kernels, scheduling, quantization, routing, configuration, and infrastructure changes.

## MUST
- Every material inference change MUST have tests covering its intended behavior and realistic failure modes.
- Validation MUST include model-loading tests, representative inference requests, cancellation, timeout, and overload behavior where relevant.
- Numerical or semantic correctness checks MUST compare against an accepted baseline when low-level execution changes.
- Performance-sensitive changes MUST include repeatable benchmarks under representative workload distributions.
- Production-critical paths MUST have integration or end-to-end validation beyond unit tests alone.
- Regression tests MUST be added for reproducible production failures when practical.

## MUST NOT
- MUST NOT treat successful process startup as proof that a model is safe to serve.
- MUST NOT rely only on synthetic tiny prompts when long contexts or large outputs are production-relevant.
- MUST NOT disable failing tests to unblock rollout without documented root cause, risk, and approval.
- MUST NOT claim a fix is complete without reproducing or otherwise bounding the original failure.

## SHOULD
- Test environments SHOULD match production runtime, device class, and serving configuration closely enough to expose material incompatibilities.
- Failure injection SHOULD cover OOM, worker loss, dependency failure, and queue saturation where applicable.

## Exceptions
Exceptions require documented coverage gap, rationale, compensating evidence, risk, and reviewer approval for production-critical changes.

## Verification
Review CI results, integration tests, benchmark artifacts, failure tests, regression coverage, and release criteria. Confirm all material changed behaviors have evidence.