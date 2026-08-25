# Event Time and Windowing Rules

## Purpose
Make temporal computations deterministic and understandable under delay, disorder, and clock variance.

## Scope
Applies to event time, processing time, ingestion time, watermarks, windows, lateness, and temporal joins.

## MUST
- Each temporal computation MUST identify its time domain and timestamp source.
- Event-time timestamps MUST represent a documented domain occurrence, not an arbitrary processing clock.
- Watermark and allowed-lateness policies MUST be derived from observed delay distributions and business correctness needs.
- Window boundaries, timezone assumptions, inclusivity, and late-event behavior MUST be explicit.
- Temporal joins MUST define tolerance/range and unmatched-event behavior.

## MUST NOT
- MUST NOT mix event time and processing time implicitly in one business metric.
- MUST NOT discard late events silently when they can affect correctness.
- MUST NOT use local timezone assumptions for distributed timestamps without an explicit contract.
- MUST NOT claim deterministic results when processing-time behavior can materially alter output.

## SHOULD
- UTC instants SHOULD be used for transport while business timezone interpretation remains explicit.
- Late-event and watermark metrics SHOULD be monitored.

## Exceptions
Processing-time approximations require documented acceptable error, latency benefit, and stakeholder acceptance.

## Verification
Test boundary timestamps, disorder, delayed arrivals, clock anomalies, daylight-saving transitions where relevant, and deterministic replay outputs.