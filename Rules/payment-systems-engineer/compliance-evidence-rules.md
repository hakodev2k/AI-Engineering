# Payment Compliance and Evidence Rules

## Purpose
Ensure payment controls are demonstrable through durable technical evidence rather than unsupported claims.

## Scope
Payment security, access, data handling, change control, reconciliation, incident response, and regulated payment processes.

## MUST
- Control claims MUST map to inspectable evidence such as configuration, logs, approvals, tests, reports, or immutable records.
- Evidence MUST identify relevant system, control period, owner, and source where practical.
- Sensitive evidence MUST be access-controlled and retained according to applicable policy and regulatory requirements.
- Exceptions to payment controls MUST record rationale, risk, compensating control, approver, and expiry or review date.
- Evidence collection MUST preserve integrity and MUST NOT depend solely on manually editable summaries when authoritative technical records exist.

## MUST NOT
- MUST NOT represent a control as effective when required evidence is missing or stale.
- MUST NOT fabricate, backdate, or selectively omit evidence to satisfy review.
- MUST NOT expose prohibited payment data in compliance artifacts.

## SHOULD
- Evidence generation SHOULD be automated from authoritative systems where practical.

## Exceptions
Exceptions require compliance or risk-owner approval and documented alternative evidence.

## Verification
Sample control mappings, compare evidence to source systems, inspect exception expiry, verify retention/access controls, and test reproducibility of automated evidence.