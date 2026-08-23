# Regulatory and Compliance Architecture Rules

## Purpose
Translate legal, regulatory, contractual, and policy obligations into verifiable architecture constraints.

## Scope
Regulated data, records, audit, residency, retention, privacy, industry controls, and contractual obligations.

## MUST
- Applicable obligations MUST be mapped to systems, data, processes, owners, and controls.
- Architecture MUST distinguish mandatory obligations from internal preferences.
- Material compliance claims MUST have evidence from qualified review, control validation, or authoritative interpretation.

## MUST NOT
- MUST NOT invent legal interpretations or silently downgrade mandatory controls.
- MUST NOT move regulated data across boundaries without validating residency, transfer, and contractual constraints.

## SHOULD
- Prefer reusable controls that satisfy multiple obligations without obscuring accountability.

## Exceptions
Only authorized risk or compliance authorities may approve deviations where legally permissible.

## Verification
Inspect obligation-control mappings, data flows, assessments, audit evidence, and approved exceptions.