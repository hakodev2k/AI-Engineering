# Pipeline Quality Gate Rules
## Purpose
Prevent known-bad data from propagating unchecked.
## Scope
Ingestion, transformation, publication, and release gates.
## MUST
- Critical publication points MUST execute relevant quality gates before data is marked trusted.
- Gate failures MUST have explicit fail-closed, quarantine, or degraded-service behavior based on impact.
- Gate logic MUST be deterministic and observable.
## MUST NOT
- MUST NOT bypass a blocking quality gate without authorized risk acceptance.
- MUST NOT publish quarantined data as trusted.
## SHOULD
- Gates SHOULD run as early as practical to reduce blast radius.
## Exceptions
Emergency bypasses require owner approval, expiry, consumer notice, and remediation tracking.
## Verification
Inspect CI/pipeline configuration, gate results, quarantine paths, bypass logs, and publication status.