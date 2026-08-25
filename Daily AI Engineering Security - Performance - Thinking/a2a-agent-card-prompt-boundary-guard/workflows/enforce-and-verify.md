# Workflow: Enforce and Verify

## Trigger
Research workflow confirms a trust-boundary gap.

## Goal
Enforce data-role isolation and validate it without weakening functionality required for correct A2A discovery.

## Inputs
Baseline, remediation decision, card fixtures, local network policy.

## Baseline
Record existing pass/block set and model message roles before modification.

## Stages
1. Add pre-consumption validation.
2. Refactor prompt construction so remote prose is serialized only inside an explicit untrusted-data envelope/user-data role.
3. Keep local authorization separate from card prose.
4. Run unit/adversarial tests.
5. Inspect final serialized requests.
6. Compare baseline functionality and security metrics.
7. Independent review.

## Responsible agent
Implementation agent; separate security reviewer verifies.

## Outputs
Validated integration and verification evidence.

## Checkpoints
Pre-change baseline; post-validation; post-role inspection; reviewer sign-off.

## Metrics
Adversarial block rate, benign compatibility rate, privileged-role remote strings (target 0), validation latency.

## Retry policy
At most two remediation iterations. Do not loosen network or role isolation to make a test pass.

## Stop conditions
All required tests pass with zero privileged-role remote prose, or a blocking incompatibility is escalated.

## Failure path
If benign compatibility regresses, narrow the deterministic rule while preserving role isolation; otherwise require human exception approval.

## Verification
Run test suite and inspect production-equivalent serialization.

## Definition of Done
Implemented, measured and independently verified with no blocking finding.
