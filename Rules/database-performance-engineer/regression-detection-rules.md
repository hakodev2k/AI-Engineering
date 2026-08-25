# Performance Regression Detection Rules
## Purpose
Detect degradations before they become persistent production incidents.
## Scope
Query regressions, plan changes, schema releases, engine upgrades, and workload drift.
## MUST
- Establish baselines for critical database paths and alert on materially significant deviation.
- Compare releases and configuration changes against known performance indicators.
- Distinguish workload growth from efficiency regression before remediation.
## MUST NOT
- Mark a regression resolved solely because current load decreased.
- Ignore tail-latency regressions hidden by stable averages.
## SHOULD
- Track plan or query fingerprints for critical workloads when supported.
## Exceptions
Noisy exploratory workloads may use broader thresholds if they cannot affect critical capacity.
## Verification
Review baseline history, alerts, release comparisons, query fingerprints, plan history, and normalized workload metrics.