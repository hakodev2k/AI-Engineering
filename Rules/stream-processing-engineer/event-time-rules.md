# Event Time
## Purpose
Preserve correct temporal semantics in streaming computations.
## Scope
Event-time assignment, watermarks, windows, and late data.
## MUST
- Event-time fields MUST have a documented source, timezone, precision, and validity rule.
- Watermark strategy MUST reflect measured out-of-order behavior and define lateness tolerance.
- Windowed results MUST define when they are provisional versus final.
## MUST NOT
- Processing time MUST NOT substitute for event time when business correctness depends on occurrence time.
- Late events MUST NOT be silently discarded.
## SHOULD
- Timestamp extraction SHOULD be tested against malformed, missing, future, and delayed events.
## Exceptions
Exceptions require documented semantics, correctness impact, evidence, and reviewer approval.
## Verification
Review schemas and configuration; test boundary timestamps, delayed events, watermark progression, and window closure.