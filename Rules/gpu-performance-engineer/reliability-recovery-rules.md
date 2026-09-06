# Reliability and Recovery Rules

## Purpose
Ensure GPU workloads recover predictably from device, runtime, process, and communication failures.

## Scope
Device faults, runtime errors, process failure, checkpointing, retries, failover, and degraded operation.

## MUST
- Production workloads MUST define behavior for recoverable and non-recoverable accelerator failures.
- Retry logic MUST be bounded and MUST distinguish transient failures from deterministic faults.
- Distributed workloads MUST define how rank or device failure propagates and how partial work is discarded or recovered.
- Recovery paths MUST preserve correctness and data integrity.
- Recurrent device errors MUST be surfaced for hardware or infrastructure investigation.

## MUST NOT
- MUST NOT loop indefinitely on device errors.
- MUST NOT reuse corrupted or undefined device state after fatal runtime failures.
- MUST NOT report recovery success without validating representative work after restart or failover.

## SHOULD
- SHOULD test recovery under process loss, device reset, and communication interruption where supported.
- SHOULD preserve enough diagnostics to distinguish application, runtime, and hardware causes.

## Exceptions
Exceptions require documented failure assumptions, mitigation, and owner approval.

## Verification
Run failure-injection tests, inspect retry limits, recovery logs, checkpoint validation, and post-recovery correctness checks.