# Forensic Acquisition Rules

## Purpose
Acquire data completely and predictably while minimizing source alteration.

## Scope
Covers disks, removable media, endpoints, servers, mobile devices, virtual systems, and logical exports.

## MUST
- Acquisition method MUST be selected according to volatility, legal authority, source technology, business impact, and evidentiary objective.
- Source identifiers, acquisition time, tool/version, method, errors, and resulting hashes MUST be recorded.
- Collection order MUST prioritize volatile evidence when delay creates material loss risk.
- Partial acquisitions MUST explicitly state excluded regions or data classes.
- Read errors and inaccessible regions MUST be preserved in acquisition records.
- Acquired output MUST be integrity-verified before source release when operationally feasible.

## MUST NOT
- MUST NOT assume a successful tool exit code proves completeness.
- MUST NOT perform destructive acquisition steps without explicit authorization.
- MUST NOT silently substitute logical acquisition for required physical acquisition.

## SHOULD
- Validate tools against known test media.
- Capture device geometry and relevant system context.
- Maintain a fallback acquisition method for critical collections.

## Exceptions
Operational constraints may justify a less complete method only when rationale, lost evidence classes, risk, alternatives, and approval are recorded.

## Verification
Compare acquisition logs, expected source capacity, hashes, error maps, artifact presence, and independent mounting or parsing results.