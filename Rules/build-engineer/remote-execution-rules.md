# Remote Execution Rules

## Purpose
Ensure distributed build execution is correct, secure, observable, and resilient.

## Scope
Applies to remote workers, execution sandboxes, scheduling, input transfer, output retrieval, and worker trust boundaries.

## MUST
- Remote actions MUST receive complete declared inputs and explicit platform requirements.
- Worker environments MUST be isolated sufficiently to prevent cross-build contamination.
- Remote outputs MUST be integrity-validated before use in later build stages.
- Scheduler failures, worker loss, and transient transport errors MUST have bounded retry behavior.
- Release-critical remote execution MUST preserve provenance linking actions to source revision and toolchain.

## MUST NOT
- MUST NOT grant remote build workers broader credentials than their tasks require.
- MUST NOT assume remote retries are safe for actions with undeclared external side effects.
- MUST NOT accept outputs from incompatible worker platforms.

## SHOULD
- Remote execution SHOULD degrade to an explicitly supported fallback when service availability permits it.
- Queue time, execution time, transfer time, and retry rates SHOULD be measured separately.

## Exceptions
Exceptions require documented trust assumptions, failure behavior, compensating controls, and operational approval.

## Verification
Inspect action metadata, sandbox configuration, worker identity, retry logs, output digests, and remote-versus-local equivalence tests.