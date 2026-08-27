# Instance Configuration

## Purpose
Set SQL Server instance-level configuration from measured workload and host constraints rather than folklore.

## When to use
Use for new instances, capacity reviews, migrations, or systemic performance problems.

## Inputs
CPU topology, RAM, storage, workload concurrency, database sizes, edition/version, host co-tenancy.

## Context to inspect
Inspect max server memory, MAXDOP, cost threshold, tempdb, optimize-for-ad-hoc behavior, file defaults, power plan, service accounts, and current waits.

## Core knowledge
Instance settings are workload-wide controls. Changes can improve one query while degrading concurrency or other databases, so defaults should be changed only with a reason and measurement.

## Procedure
1. Inventory host resources and competing services.
2. Baseline workload, waits, CPU, memory, and I/O.
3. Reserve non-buffer-pool memory for OS and co-located needs.
4. Evaluate parallelism settings against workload and NUMA topology.
5. Configure predictable file growth and tempdb.
6. Review plan-cache behavior and operational defaults.
7. Change one causal area at a time where practical.
8. Monitor over representative peak periods.

## Decision points
Choose MAXDOP and memory limits from topology/workload guidance plus measurements; avoid universal magic numbers.

## Common failure patterns
Allocating nearly all RAM to SQL Server, changing many settings simultaneously, low fixed cost threshold copied from old guidance, and ignoring VM/container host constraints.

## Verification
Compare throughput, tail latency, waits, CPU scheduling, memory pressure, and I/O before and after.

## Expected output
Documented configuration baseline, rationale, measured impact, and rollback values.

## Stop conditions
Stop when host ownership or resource reservations are unknown.