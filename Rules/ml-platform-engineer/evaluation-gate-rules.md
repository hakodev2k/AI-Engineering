# Evaluation Gates

## Purpose
Prevent models from advancing without evidence appropriate to their risk and use case.

## Scope
Offline evaluation, acceptance thresholds, regression checks, and promotion gates.

## MUST
- Promotion gates MUST define required metrics, datasets, tolerances, and blocking conditions before evaluation runs.
- Candidate models MUST be compared against an explicit baseline using compatible evaluation methodology.
- Safety, fairness, robustness, or domain-specific checks MUST be included when required by model risk.

## MUST NOT
- Aggregate metric improvement MUST NOT override a known critical-segment regression without explicit acceptance.
- Gates MUST NOT be bypassed silently.

## SHOULD
- Statistical uncertainty SHOULD be reported where sampling variability affects decisions.

## Exceptions
Gate overrides require evidence, risk owner approval, expiry or follow-up, and auditability.

## Verification
Inspect evaluation definitions, immutable results, CI/promotion logs, baseline comparisons, segment reports, and override records.