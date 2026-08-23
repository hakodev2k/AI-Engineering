# Incident Metrics Rules

## Purpose
Measure incident response and reliability learning without incentivizing misleading behavior.

## Scope
Detection time, acknowledgement, mitigation, recovery, recurrence, impact, and action effectiveness.

## MUST
- Define metric start and end events consistently and document changes to definitions.
- Pair speed metrics with impact, quality, recurrence, and correctness evidence.
- Segment metrics where aggregation would hide materially different incident classes.
- Use metrics to identify system and process trends rather than rank individual responders.

## MUST NOT
- Optimize mean time metrics by prematurely declaring mitigation or closure.
- Compare teams or periods using incompatible severity or timing definitions without qualification.

## SHOULD
- Track detection gaps, rollback effectiveness, repeated failure modes, action completion effectiveness, and customer-impact duration.

## Exceptions
Small samples may be reported descriptively, but statistical claims MUST state limitations.

## Verification
Audit metric definitions, source events, calculations, incident samples, exclusions, and whether conclusions are supported by the data.