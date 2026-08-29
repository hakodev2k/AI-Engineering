# Release and Rollout Rules

## Purpose
Reduce production risk when changing models, runtimes, kernels, serving configuration, or infrastructure.

## Scope
Applies to canaries, staged rollout, model replacement, runtime upgrades, configuration changes, and rollback.

## MUST
- Every production release MUST identify the exact model, runtime, configuration, and infrastructure versions being changed.
- Material inference changes MUST use staged exposure with predefined success and abort criteria.
- Rollback MUST be tested or otherwise demonstrated feasible before broad rollout.
- Canary evaluation MUST include correctness, error rate, latency, throughput, memory, and user-impacting quality metrics relevant to the change.
- Breaking request or response contract changes MUST receive explicit approval before execution.
- Production deployment or irreversible change MUST require authorized human approval when the operating environment requires it.

## MUST NOT
- MUST NOT combine unrelated model, runtime, and infrastructure migrations into one high-risk release without a documented necessity.
- MUST NOT continue rollout after abort criteria are met without explicit incident-level review.
- MUST NOT overwrite a known-good artifact needed for rollback.

## SHOULD
- Releases SHOULD isolate one major risk dimension at a time.
- Automated rollback SHOULD be used only when signals are trustworthy and rollback itself is safe.

## Exceptions
Emergency changes require incident context, risk acceptance, minimum validation, rollback strategy, and authorized approval.

## Verification
Review deployment manifests, canary metrics, change records, approval evidence, abort thresholds, and rollback exercises.