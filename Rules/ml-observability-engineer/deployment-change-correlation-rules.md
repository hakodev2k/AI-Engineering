# Deployment and Change Correlation

## Purpose
Make production behavior changes traceable to model, code, configuration, data, and infrastructure changes.

## Scope
Applies to deployments, model promotions, feature changes, runtime upgrades, configuration changes, and data-pipeline releases.

## MUST
- Operational telemetry MUST expose immutable or traceable identifiers for material deployed artifacts and configurations.
- Deployment and configuration events MUST be available on the same investigation timeline as quality and service metrics.
- Monitoring MUST distinguish pre-change and post-change populations when evaluating a suspected regression.
- High-risk changes MUST define expected signals and rollback indicators before production execution.

## MUST NOT
- MUST NOT diagnose a regression from a deployment timestamp alone without testing competing hypotheses.
- MUST NOT deploy an untraceable model or configuration artifact to a production-critical path.
- MUST NOT erase historical version context when rolling back.

## SHOULD
- Annotate dashboards and evaluation views with release events automatically.
- Preserve comparison windows long enough to assess delayed quality effects.

## Exceptions
Emergency changes require retrospective artifact identification, evidence preservation, and review after stabilization.

## Verification
Inspect artifact metadata, deployment event streams, dashboard annotations, rollback records, and incident timelines for complete change correlation.