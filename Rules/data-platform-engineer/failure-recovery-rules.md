# Failure and Recovery Rules

## Purpose
Ensure data platform failures are contained, recoverable, and do not silently convert temporary faults into permanent data loss or corruption.

## Scope
Applies to services, pipelines, state stores, queues, storage, orchestration, external dependencies, and recovery workflows.

## MUST
- Critical components MUST define failure modes, recovery objectives, dependency behavior, and the authoritative source used for reconstruction.
- Retries MUST be bounded, use appropriate backoff, and avoid multiplying side effects or overload.
- Recovery procedures MUST distinguish replay, restore, recomputation, failover, and manual correction and state their data-consistency implications.
- Recovery from production-critical failure MUST include post-recovery validation before normal operation is declared restored.
- Irreversible recovery actions that can delete or overwrite authoritative data MUST require explicit human approval unless an approved emergency procedure applies.

## MUST NOT
- MUST NOT treat retry as a substitute for identifying permanent failures.
- MUST NOT automatically overwrite healthy replicas or snapshots from an unverified damaged source.
- MUST NOT declare recovery complete solely because processing resumed.

## SHOULD
- Prefer recovery paths that are routinely exercised and automated with bounded authority.
- SHOULD preserve forensic evidence for material failures until investigation needs are satisfied.

## Exceptions
Exceptions require documented incident context, risk, evidence, recovery rationale, validation criteria, and accountable approval.

## Verification
Use failover exercises, replay and restore tests, fault injection, reconciliation checks, dependency outage tests, and review of real incident recovery evidence.