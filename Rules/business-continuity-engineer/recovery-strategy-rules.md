# Recovery Strategy Rules

## Purpose
Ensure continuity strategies are proportionate, feasible, and aligned with approved business recovery objectives.

## Scope
Applies to technology, workforce, facility, supplier, and process recovery strategies.

## MUST
- Each critical capability MUST have a documented recovery strategy that can meet its approved RTO and RPO.
- Strategies MUST identify prerequisites, dependencies, capacity assumptions, staffing needs, and failure modes.
- Material strategy changes MUST be assessed for cost, resilience, security, compliance, and operational impact.
- Recovery strategies MUST include a fallback when the preferred recovery mechanism is unavailable.

## MUST NOT
- MUST NOT rely on untested manual workarounds as the sole recovery strategy for critical services.
- MUST NOT assume cloud, alternate-site, or supplier capacity is available without contractual or technical evidence.

## SHOULD
- Prefer strategies that reduce single points of failure and manual coordination.
- Prefer reversible changes during recovery where feasible.

## Exceptions
Exceptions require documented impact, compensating controls, accountable-owner approval, and a remediation date.

## Verification
Inspect recovery designs, dependency evidence, supplier commitments, capacity tests, exercise results, and remediation records.
