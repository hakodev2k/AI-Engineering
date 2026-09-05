# Disaster Recovery for AI Artifacts

## Purpose
Ensure critical AI artifacts and service state can be restored after regional, storage, provider, or operator failures.

## When to use
Use for production systems that depend on prompts, model artifacts, indexes, configuration, state, evaluation baselines, or fine-tuning data.

## Inputs
RTO/RPO requirements, artifact inventory, storage topology, backup policy, deployment process, dependency map.

## Preconditions
Critical assets and ownership are identified.

## Context to inspect
Model artifacts, prompt registries, configuration stores, vector indexes, source corpora, databases, secrets, CI/CD, registries, backups, replication.

## Core knowledge
Not every AI artifact should be backed up the same way. Some can be deterministically rebuilt from source data; others require durable backup. Recovery plans must account for dependency order and provider availability.

## Procedure
1. Inventory production-critical artifacts and state.
2. Classify each as rebuildable, replicated, or backup-required.
3. Define RTO and RPO by user impact.
4. Verify backup isolation and retention.
5. Document restore order and dependency prerequisites.
6. Automate restoration where practical.
7. Rebuild indexes from authoritative sources when safer than restoring stale snapshots.
8. Test provider or region substitution.
9. Run recovery drills and measure actual RTO/RPO.
10. Update procedures after architecture changes.

## Decision points
Prefer rebuild from authoritative data when deterministic and within RTO; use backup restoration when source reconstruction is too slow or impossible.

## Common failure patterns
Backups in the same failure domain, untested restores, missing prompt/config versions, stale restored indexes, and recovery tooling dependent on the failed control plane.

## Verification
A recovery exercise restores a representative environment within target objectives and validates functional, security, and data integrity.

## Expected output
A tested DR plan with asset classification, backup/rebuild strategy, dependency order, RTO/RPO evidence, and owners.

## Stop conditions
Escalate when required recovery objectives cannot be met or backups cannot be independently verified.