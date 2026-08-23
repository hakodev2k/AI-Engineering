# Blast Radius Rules
## Purpose
Bound harm from resilience experiments.
## Scope
Targets, tenants, regions, traffic, and duration.
## MUST
- Define maximum affected scope before execution.
- Begin with minimal representative scope and expand only after evidence supports it.
- Protect critical dependencies and unrelated tenants.
## MUST NOT
- Run unbounded production fault injection.
- Expand scope while health evidence is inconclusive.
## SHOULD
- Use canary targets and isolated cohorts.
## Exceptions
Large-scale game days require explicit approval and recovery capacity.
## Verification
Inspect targeting, safeguards, exposure, and experiment logs.