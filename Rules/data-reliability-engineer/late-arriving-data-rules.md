# Late-Arriving Data Rules

## Purpose
Handle delayed and out-of-order data without silent loss or incorrect aggregates.

## Scope
Event-time processing, batch arrivals, watermarks, windows, CDC, corrections, and delayed source delivery.

## MUST
- Define lateness semantics for every time-sensitive pipeline.
- Distinguish event time from processing time where ordering affects correctness.
- Define how late records update historical results, aggregates, and downstream consumers.
- Monitor late-arrival rates and their business impact.

## MUST NOT
- Drop late records silently because a processing window has closed.
- Assume arrival order equals business-event order unless guaranteed by the source contract.
- Finalize irreversible outputs before the accepted lateness policy is satisfied without explicit risk acceptance.

## SHOULD
- Use watermarks or equivalent bounded-lateness mechanisms when supported.
- Preserve correction metadata for material restatements.

## Exceptions
Discard policies require documented thresholds, impact analysis, evidence, and approval.

## Verification
Test out-of-order scenarios, delayed replay, watermark behavior, historical corrections, and reconciliation against source event timestamps.