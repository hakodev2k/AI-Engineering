# Data Freshness Rules

## Purpose
Make timeliness expectations explicit and prevent stale analytics from being mistaken for current state.

## Scope
Applies to source ingestion, warehouse models, extracts, semantic models, and dashboards.

## MUST
- Production datasets MUST define expected refresh cadence and maximum acceptable staleness where timeliness affects decisions.
- Dashboards MUST expose data-as-of time when users could otherwise infer real-time freshness.
- Freshness breaches that materially affect decisions MUST be detectable and communicated.
- Dependency delays MUST propagate into downstream freshness status.

## MUST NOT
- MUST NOT display stale data as current without an explicit indicator.
- MUST NOT declare a refresh successful when required upstream partitions are missing.

## SHOULD
- Freshness objectives SHOULD align with business decision latency rather than tool capability alone.

## Exceptions
Exceptions require documented business tolerance, affected consumers, mitigation, and owner approval.

## Verification
Inspect refresh SLAs, timestamps, dependency checks, alert history, and stale-data behavior.