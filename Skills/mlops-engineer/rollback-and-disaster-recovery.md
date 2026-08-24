# Rollback and Disaster Recovery

## Purpose
Restore ML services and pipelines after bad model releases, artifact loss, regional failure, corrupted state, or critical dependency outage.

## When to use
Use when defining production readiness, conducting resilience reviews, or responding to failures that exceed ordinary retry mechanisms.

## Inputs
Model registry, artifact stores, deployment manifests, data/feature dependencies, infrastructure state, RTO/RPO targets, backup policy, fallback models.

## Preconditions
Critical ML services and data stores have explicit recovery objectives.

## Context to inspect
Artifact retention, backups, registry replication, IaC, deployment history, feature stores, secrets, DNS/routing, and historical outages.

## Core knowledge
Rollback restores a previous known-good application/model state; disaster recovery restores service capability after infrastructure or state loss. Recovery must include compatible dependencies, not only model weights.

## Procedure
1. Identify critical components and dependencies.
2. Define RTO/RPO and rollback triggers.
3. Retain immutable known-good model/runtime artifacts.
4. Version deployment and feature/schema contracts.
5. Back up required control-plane metadata and state.
6. Define regional/account/project recovery steps.
7. Prepare fallback behavior when full recovery is slow.
8. Test model rollback independently from platform DR.
9. Run periodic restore exercises.
10. Record measured recovery time and gaps.

## Decision points
Warm standby vs rebuild-from-IaC; fallback model vs service unavailability; cross-region replication based on impact and cost.

## Common failure patterns
Rollback model incompatible with current features, backups never restored, missing registry metadata, mutable artifacts overwritten, and DR relying on the same failed identity or region.

## Verification
Execute controlled rollback and recovery drills, measure RTO/RPO, and verify predictions plus downstream contracts after restoration.

## Expected output
Recovery architecture, rollback matrix, backup/restore procedure, fallback plan, drill evidence, and residual risks.

## Stop conditions
Escalate when recovery objectives cannot be met, backups are unverified, or restoring an older model would violate current safety/data contracts.