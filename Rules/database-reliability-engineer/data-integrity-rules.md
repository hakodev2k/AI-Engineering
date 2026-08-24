# Data Integrity Rules

## Purpose
Protect correctness, durability, and detectability of data corruption.

## Scope
Constraints, checksums, validation, repair, corruption detection, and integrity-sensitive operations.

## MUST
- Enforce integrity constraints at the strongest practical layer.
- Detect and investigate corruption, checksum failures, and impossible state transitions promptly.
- Validate repaired or restored data before returning it to normal service.
- Preserve evidence before destructive repair actions when incident analysis may be required.

## MUST NOT
- Do not disable integrity controls to bypass application defects without approved mitigation.
- Do not overwrite suspected-corrupt data before preserving recoverable evidence.

## SHOULD
- Run recurring integrity checks appropriate to the engine and workload.

## Exceptions
Any temporary relaxation requires scope, reason, compensating controls, expiry, and approval.

## Verification
Inspect constraints, integrity-check results, corruption alerts, repair records, and restore validation.