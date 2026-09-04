# Governance Exception Rules

## Purpose
Allow justified deviations from API standards without turning exceptions into undocumented permanent policy.

## Scope
Applies whenever an API cannot comply with an applicable governance requirement.

## MUST
- Every exception MUST identify the exact rule being waived, affected APIs, business or technical reason, evidence, alternatives considered, risk, and accountable owner.
- Exceptions MUST define scope, approval authority, verification method, and review or expiry criteria.
- Security, privacy, destructive-change, and breaking-contract exceptions MUST receive approval from the accountable human authority for that risk domain.
- Material exceptions MUST be discoverable during design review and future contract changes.
- Repeated similar exceptions MUST trigger review of either the standard or the underlying architecture problem.

## MUST NOT
- Exceptions MUST NOT use vague justification such as convenience, urgency, or legacy constraints without evidence and bounded impact.
- An exception MUST NOT silently expand to APIs or teams outside its approved scope.
- Expired exceptions MUST NOT remain effective without explicit renewal.
- Governance tooling MUST NOT suppress violations permanently without an associated approved exception record.

## SHOULD
- Exceptions SHOULD be time-bounded when remediation is feasible.
- Governance owners SHOULD track exception trends to identify standards that are impractical or controls that are being systematically bypassed.

## Exceptions
This document governs exceptions themselves; deviation from this process requires explicit approval from the highest accountable governance owner and documented risk acceptance.

## Verification
Inspect exception records, approvals, expiry dates, CI suppressions, rule waivers, remediation status, and audit history. Confirm each active waiver maps to a current approved scope and that expired waivers no longer suppress enforcement.