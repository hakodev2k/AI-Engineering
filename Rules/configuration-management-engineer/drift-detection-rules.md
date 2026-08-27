# Drift Detection and Reconciliation

## Purpose
Detect and safely reconcile divergence between intended and effective configuration.

## Scope
Managed hosts, services, cloud resources, runtime configuration, policies, and generated artifacts.

## MUST
- Critical managed configuration MUST have a defined drift-detection method.
- Drift findings MUST identify expected state, observed state, scope, and detection time.
- Reconciliation policy MUST distinguish safe automatic correction from changes requiring human review.
- Persistent or recurring drift MUST trigger root-cause investigation rather than repeated blind correction.
- Drift tooling MUST preserve evidence needed to understand externally initiated changes.

## MUST NOT
- Automation MUST NOT automatically revert unknown production changes when doing so could increase incident impact.
- Drift MUST NOT be dismissed solely because current service health appears normal.
- Reconciliation MUST NOT erase forensic evidence before it is captured when unauthorized change is suspected.

## SHOULD
- Prioritize drift by security, availability, compliance, and blast radius.
- Measure drift frequency and time-to-reconcile.

## Exceptions
Resources intentionally unmanaged or partially managed require explicit ownership boundaries and documented excluded attributes.

## Verification
Review drift reports, reconciliation logs, excluded-field policies, incident records, and metrics. Inject controlled drift in safe environments and confirm detection, classification, and reconciliation behave as designed.