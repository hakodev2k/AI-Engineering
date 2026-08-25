# Workflow — Failure Recovery

## Detection
Collector error, too few samples, missing baseline, analyzer exit 2/3, or regression persists after a change.

## Evidence
Preserve CSVs, policy, Windows/app build, scenario notes, and analyzer report.

## Retry policy
Bad collection: once. Hypothesis tests: maximum three. Implementation attempts: maximum two.

## Fallback
Return to a known-good app/configuration where available; otherwise stop optimization and escalate with evidence. Do not delete state or weaken permissions.

## Escalation
Desktop runtime owner; use WPR/WPA or vendor diagnostics only after the process/time window is narrowed.

## Stop condition
Retry budget exhausted or safe matched measurement cannot be obtained.
