# Scheduling and Placement Rules
## Purpose
Make workload placement predictable across failure domains and node classes.
## Scope
Affinity, anti-affinity, topology spread, taints, tolerations, selectors, priorities, and disruption.
## MUST
- Encode placement constraints required for hardware, isolation, locality, or availability.
- Spread critical replicas across relevant failure domains when the infrastructure supports it.
- Validate that priority classes cannot starve more critical platform workloads.
## MUST NOT
- Add broad tolerations that unintentionally permit sensitive node placement.
- Use hard affinity where a soft preference satisfies the requirement and avoids unschedulability.
## SHOULD
- Test placement behavior during node loss and scale-out.
## Exceptions
Single-zone or specialized-hardware constraints must document reduced resilience.
## Verification
Inspect scheduler events, pod placement, topology labels, taints, priority classes, and failure tests.