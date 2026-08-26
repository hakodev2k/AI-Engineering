# Capacity and Lifecycle Management

## Purpose
Keep Windows estates supportable by forecasting capacity, controlling technical debt, and planning OS/hardware lifecycle before risk becomes urgent.

## When to use
Use for quarterly planning, growth reviews, hardware/VM refresh, Windows version upgrades, support deadlines, or recurring capacity incidents.

## Inputs
Inventory, OS/build/support dates, workload growth, CPU/memory/storage/network trends, licensing/support constraints, dependencies, and business roadmap.

## Preconditions
Use measured inventory and demand rather than CMDB assumptions alone.

## Context to inspect
Asset inventory, unsupported versions, hardware/VM sizing, utilization percentiles, storage growth, patch compliance, application compatibility, vendor matrices, backup capacity, and decommission candidates.

## Core knowledge
Capacity planning must consider peaks, growth, redundancy/failover headroom, and maintenance states. Lifecycle risk includes security support, vendor compatibility, operational skill, hardware failure, and migration lead time.

## Procedure
1. Reconcile authoritative inventory with observed systems.
2. Classify assets by business criticality and lifecycle state.
3. Analyze demand trends and peak behavior.
4. Include failover and maintenance headroom in forecasts.
5. Identify support deadlines and incompatible dependencies.
6. Rank upgrades, right-sizing, consolidation, or retirement by risk/value.
7. Create migration pilots for high-risk platforms.
8. Track capacity and lifecycle actions to completion.
9. Remove retired systems from monitoring, DNS, backup, identity, and inventory cleanly.
10. Reassess forecasts after major workload changes.

## Decision points
Scale up for simple bounded growth; scale out when workload architecture and availability justify it. Upgrade in place only when support, rollback, and dependency risk are acceptable; otherwise migrate/rebuild.

## Common failure patterns
Planning from averages, ignoring failover capacity, discovering EOL at the deadline, leaving zombie servers, retaining oversized VMs indefinitely, and decommissioning without dependency discovery.

## Verification
Verify inventory accuracy, forecast assumptions, support status, migration tests, post-right-sizing performance, and complete decommission evidence.

## Expected output
A prioritized capacity and lifecycle roadmap backed by measured demand and support risk.

## Stop conditions
Stop decommissioning when ownership/dependencies are unclear, or major upgrade paths lack application/vendor validation and recovery planning.