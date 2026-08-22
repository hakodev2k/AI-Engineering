# Workflow: Azure Incident Response

**Trigger:** workload degradation suspected to originate from Azure platform/configuration.
**Stages:** establish severity and incident owner → preserve evidence → identify affected subscriptions/regions/resources → split investigations across identity/network, service health/capacity, resource configuration, and workload telemetry → form evidence-backed hypothesis → apply reversible mitigation → validate recovery → monitor → root cause → corrective actions.
**Rules:** no destructive guesswork; distinguish Azure control-plane success from data-plane health; avoid simultaneous configuration changes by multiple responders.
**Escalation:** Microsoft support, security, data owner, or leadership when authority/capability boundary is reached.
