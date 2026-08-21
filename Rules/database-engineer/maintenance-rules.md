# Maintenance Rules
## Purpose
Keep database structures and optimizer inputs healthy with controlled operational cost.
## Scope
Statistics, vacuuming, compaction, index maintenance, consistency checks, and housekeeping.
## MUST
- Base maintenance frequency on engine behavior, workload, data change, and measured need.
- Bound resource impact and schedule disruptive maintenance against service requirements.
- Monitor maintenance failures and backlog.
## MUST NOT
- Rebuild, vacuum, compact, or refresh everything on a fixed schedule without considering actual need and impact.
- Run intrusive maintenance in production without understanding locks, log growth, replica impact, and recovery implications.
## SHOULD
- Automate safe routine maintenance with observable outcomes.
## Exceptions
Emergency maintenance requires impact assessment and approval when service risk is material.
## Verification
Review maintenance history, fragmentation/statistics evidence, duration, locks, resource use, and alerts.