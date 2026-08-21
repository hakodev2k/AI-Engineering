# Cost Efficiency Rules
## Purpose
Balance performance with infrastructure and operational cost.
## Scope
Compute, memory, storage, network, managed services, and scaling choices.
## MUST
- Evaluate cost per useful unit of workload for material scaling or optimization decisions.
- Include peak, steady-state, redundancy, and data-transfer costs where relevant.
- Ensure cost reductions do not violate performance, reliability, security, or durability requirements.
## MUST NOT
- Recommend overprovisioning as the only response to an uninvestigated bottleneck.
- Optimize cost using measurements from non-representative workloads.
## SHOULD
- Compare architectural optimization with resource scaling when both are viable.
## Exceptions
Temporary overprovisioning is acceptable as a bounded mitigation with follow-up analysis.
## Verification
Review billing/resource data, utilization, capacity evidence, SLOs, and decision records.