# Azure Service Selection Heuristics

Choose services from workload characteristics rather than familiarity.

- App Service: managed web/API hosting when platform constraints fit.
- Functions: event-driven/serverless workloads with execution-model awareness.
- Container Apps: managed container workloads that do not require full Kubernetes control.
- AKS: use when Kubernetes capabilities justify operational complexity.
- VMs: use when OS/runtime control is necessary and managed PaaS is unsuitable.
- Storage services: match consistency, throughput, access pattern, lifecycle, and data classification.
- Managed databases: prefer managed operational burden where compatibility and scale permit.
- Service Bus/Event Grid/Event Hubs: select by command/message semantics, delivery expectations, ordering, throughput, and event model.

Always verify current service capabilities and regional availability before production decisions.