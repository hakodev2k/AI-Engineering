# Failure Mode Analysis Rules

## Purpose
Ensure resilience work begins with explicit, evidence-based failure models rather than optimistic assumptions.

## Scope
Applies to services, dependencies, data paths, infrastructure, control planes, and operational processes whose failure can affect availability, integrity, recoverability, or customer outcomes.

## MUST
- Critical systems MUST maintain documented failure modes covering component loss, dependency degradation, resource exhaustion, malformed inputs, operator error, regional impairment, and correlated failures where credible.
- Each material failure mode MUST identify detection signals, blast radius, expected system behavior, recovery mechanism, and residual risk.
- Failure assumptions MUST be validated against architecture, production telemetry, incident history, or controlled experiments.
- Changes that introduce new critical dependencies MUST update the failure model before production release.
- Unknown or unbounded failure behavior MUST be recorded as risk, not treated as resilience.

## MUST NOT
- MUST NOT assume redundancy eliminates failure without analyzing shared dependencies and common-mode faults.
- MUST NOT classify a failure as impossible solely because it has not occurred previously.
- MUST NOT use agent confidence, vendor marketing, or architecture diagrams alone as evidence of survivability.

## SHOULD
- Failure analysis SHOULD prioritize customer-visible and irreversible consequences before low-impact component faults.
- Teams SHOULD revisit models after major incidents, topology changes, or material traffic growth.

## Exceptions
Any omitted material failure class requires documented rationale, evidence, residual risk, review date, and approval from the accountable technical owner.

## Verification
Review failure-mode records against current dependency maps, architecture changes, incident reports, telemetry, and resilience tests. Sample critical paths and confirm every identified mode has observable detection and a credible recovery path.