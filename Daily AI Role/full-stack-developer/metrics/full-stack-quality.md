# Full-stack Quality Metrics
Use metrics to drive review, not vanity reporting.

- Acceptance coverage: accepted criteria with executable or documented verification / total criteria. Target 100% before completion.
- Contract regression count: unintended consumer-facing contract breaks. Target 0.
- Escaped defect rate: production defects attributable to released slice, tracked by severity.
- Change failure rate: releases requiring rollback, hotfix, or emergency mitigation.
- Recovery readiness: percentage of releases with tested rollback/roll-forward path. Target 100% for material changes.
- End-to-end latency: p50/p95/p99 for critical user journeys, decomposed by client/network/API/data/dependency.
- Error budget impact: change in user-visible failure rate after release.
- Migration safety: rows verified, mismatch count, lock/latency threshold breaches.
- Review closure: blocker/high findings resolved or explicitly approved by authorized human.
- Rework signal: repeated failure classes converted into test/rule/hook/monitoring prevention.

Every metric MUST name data source, time window, owner and action threshold before it is used as a gate.