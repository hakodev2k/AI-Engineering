# Configuration Governance Rules

## Purpose
Keep database configuration changes intentional, reviewable, and recoverable.

## Scope
Engine parameters, connection limits, memory, logging, replication settings, and managed-service options.

## MUST
- Manage material configuration through versioned, reviewable change processes where practical.
- Record baseline values and rationale for non-default production settings.
- Assess restart, failover, memory, security, and workload impact before changes.
- Define rollback values and verification criteria before production changes.

## MUST NOT
- Do not make undocumented production tuning changes as permanent fixes.
- Do not copy configuration between workloads without validating assumptions.

## SHOULD
- Detect configuration drift automatically for critical settings.

## Exceptions
Emergency changes require incident authority, evidence, and normalization into managed configuration after stabilization.

## Verification
Review configuration history, drift reports, change records, restart behavior, and post-change metrics.