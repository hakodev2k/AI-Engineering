# Threat Detection Rules

## Purpose
Define detection requirements that identify misuse, control degradation, credential compromise, and anomalous access across Zero Trust enforcement domains.

## Scope
Applies to identity, device, workload, network, application, data, policy, and privileged-access telemetry.

## MUST
- Detection coverage MUST prioritize high-value assets, privileged identities, externally reachable services, and controls whose compromise could enable broad access.
- Detection logic MUST identify security-relevant patterns such as unusual privilege use, repeated policy denials, unexpected token use, abnormal access volume, impossible or implausible session context, disabled-control events, and unexpected workload identity changes when applicable.
- Every production detection MUST have an owner, severity model, expected response, data dependencies, and documented limitations.
- Detection rules MUST be validated against representative events before production activation and after material telemetry or policy changes.
- Detection pipelines MUST monitor their own data freshness, ingestion gaps, parsing failures, and disabled-rule state.
- Alerts for critical Zero Trust control failures MUST route to an accountable response function.
- Detection conclusions MUST preserve evidence needed to distinguish malicious behavior from configuration, deployment, or data-quality failures.

## MUST NOT
- Alert volume MUST NOT be used as evidence of effective coverage without measuring signal quality and response usefulness.
- Critical detections MUST NOT depend on a single telemetry source when that source can fail silently and independent corroboration is practical.
- Detection rules MUST NOT collect or expose more sensitive data than required for the defined security purpose.
- Known persistent false positives MUST NOT remain unowned indefinitely.

## SHOULD
- Detection coverage SHOULD map to documented trust boundaries and high-impact abuse cases.
- Detection tuning SHOULD use observed evidence and post-incident learning rather than arbitrary threshold changes.
- High-confidence detections SHOULD support rapid containment actions through controlled response procedures.

## Exceptions
Exceptions require documented coverage gap, affected assets, evidence, risk, compensating monitoring, accountable owner, remediation or expiry date, and approval for critical assets.

## Verification
Inspect detection inventories, mappings to critical assets, sample alerts, data-health monitors, tuning records, response runbooks, test events, and historical incident evidence. Verify critical detection paths produce actionable alerts when their required conditions occur.