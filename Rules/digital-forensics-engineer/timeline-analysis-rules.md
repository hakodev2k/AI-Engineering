# Timeline Analysis Rules

## Purpose
Build defensible event sequences without overstating timestamp precision or causality.

## Scope
Applies to filesystem, application, identity, network, cloud, database, and security-event timelines.

## MUST
- Timeline entries MUST retain source, original timestamp, timezone interpretation, and transformation method.
- Clock skew, timestamp semantics, granularity, and known reset behavior MUST be evaluated.
- Correlation MUST distinguish temporal proximity from proven causation.
- Normalization MUST preserve original values.
- Conflicting timestamps MUST remain visible and be reconciled or explicitly unresolved.
- Material sequence claims MUST be supported by multiple artifacts when practical.

## MUST NOT
- MUST NOT silently convert unknown timezone data to a presumed timezone.
- MUST NOT infer user action solely from file timestamps when automated processes are plausible.
- MUST NOT round timestamps in a way that changes event ordering.

## SHOULD
- Maintain both normalized and source-native timeline views.
- Use confidence annotations for inferred events.

## Exceptions
A single-source conclusion is acceptable when no independent source exists, provided limitations and confidence are stated.

## Verification
Reproduce normalization, compare source-native timestamps, test clock-offset assumptions, and trace each material event back to its originating artifact.