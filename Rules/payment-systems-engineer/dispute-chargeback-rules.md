# Dispute and Chargeback Rules

## Purpose
Manage disputes, chargebacks, evidence, deadlines, and financial exposure deterministically.

## Scope
Dispute intake, reason codes, evidence collection, representment, pre-arbitration, arbitration, and financial postings.

## MUST
- Disputes MUST be linked to the original payment and relevant settlement records.
- Deadline-driven actions MUST store provider/network due dates and alert before expiry.
- Chargeback financial effects MUST be posted explicitly and reconciled to provider statements.
- Evidence submissions MUST be immutable after submission or versioned with clear supersession history.
- Dispute status mappings MUST preserve provider-specific detail without corrupting stable internal states.

## MUST NOT
- MUST NOT overwrite prior evidence or status history.
- MUST NOT assume a won dispute is financially final until provider settlement reflects the result.
- MUST NOT miss deadlines because of transient job failure without alerting and recovery.

## SHOULD
- Repeated dispute patterns SHOULD feed back into fraud and product-risk analysis.

## Exceptions
Exceptions require documented provider constraints and accountable owner approval.

## Verification
Inspect deadline alerts, evidence history, financial postings, provider reconciliation, and replay tests for late or duplicate dispute events.