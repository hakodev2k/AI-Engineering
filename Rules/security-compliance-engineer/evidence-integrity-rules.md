# Evidence Integrity Rules

## Purpose
Ensure compliance evidence is trustworthy, reproducible, attributable, and sufficient to support assurance conclusions.

## Scope
Applies to screenshots, logs, exports, tickets, configuration snapshots, reports, attestations, test results, and other control evidence.

## MUST
- Evidence MUST identify source, collection time, relevant scope, collector or system, and the control it supports.
- Evidence MUST be retained in a manner that protects integrity and prevents unauthorized alteration.
- Sampling methods MUST be documented when evidence does not cover the full population.
- Automated evidence collection MUST preserve enough metadata to reproduce or validate the result.

## MUST NOT
- Evidence MUST NOT be fabricated, manually altered to appear compliant, or presented without disclosing known gaps.
- Screenshots alone MUST NOT be used where machine-verifiable configuration or logs are reasonably available.
- Stale evidence MUST NOT be reused for a different audit period without confirming continued applicability.

## SHOULD
- Prefer immutable or system-generated evidence.
- Automate recurring evidence capture where provenance and access controls can be maintained.

## Exceptions
Manual evidence is acceptable when automation is infeasible, provided provenance, review, and tamper risk are documented.

## Verification
Inspect metadata, retention controls, access history, source-system records, sampling rationale, and reproducibility of selected evidence.