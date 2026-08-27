# Data Integrity

## Purpose
Preserve correctness of persisted data through failures, changes, and operations.

## Scope
Constraints, corruption detection, consistency checks, repairs, and integrity validation.

## MUST
- Integrity constraints MUST be enforced in the database when they represent invariants that must hold regardless of client behavior and the platform supports them appropriately.
- Corruption or consistency warnings MUST be treated as high-priority evidence until bounded and explained.
- Repair actions that can discard data MUST require explicit approval and a preserved recovery option where possible.
- Integrity checks MUST be scheduled according to data criticality and engine capabilities.

## MUST NOT
- MUST NOT disable constraints permanently merely to make invalid data load successfully.
- MUST NOT run destructive repair commands before preserving available evidence and evaluating restore/recovery alternatives.
- MUST NOT declare data healthy solely because queries succeed.

## SHOULD
- Bulk loads SHOULD validate source and target counts or checksums where practical.
- Integrity incidents SHOULD trigger root-cause and blast-radius analysis.

## Exceptions
Temporary constraint suspension requires controlled scope, validation before re-enable, and documented approval.

## Verification
Inspect constraints, integrity-check results, repair history, consistency tests, load reconciliations, and incident records.