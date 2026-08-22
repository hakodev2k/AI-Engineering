# CI/CD Platform

## Purpose
Provide secure, scalable delivery primitives that teams can reuse across services.

## When to use
Use when pipelines are duplicated, inconsistent, slow, insecure, or difficult to operate.

## Inputs
Repositories, build systems, artifact stores, environments, deployment strategies, and compliance controls.

## Context to inspect
Runners, credentials, caches, artifacts, approvals, branch protections, deployment targets, and rollback mechanisms.

## Core knowledge
Delivery platforms should make provenance, immutability, least privilege, reproducibility, and rollback first-class.

## Procedure
1. Inventory common pipeline stages.
2. Separate reusable platform primitives from application logic.
3. Harden runner identity and secret access.
4. Produce immutable versioned artifacts once.
5. Promote artifacts across environments.
6. Add policy, test, and approval gates based on risk.
7. Support progressive deployment and rollback.
8. Instrument queue time, duration, and failures.

## Decision points
Centralize stable security and delivery controls; keep workload-specific tests near application ownership.

## Common failure patterns
Long-lived credentials, rebuilding per environment, mutable tags, copy-pasted pipelines, excessive gates, and untested rollback.

## Verification
Artifact provenance is traceable, unauthorized deployment is blocked, rollback is exercised, and pipeline metrics meet targets.

## Expected output
Reusable CI/CD capabilities with secure identity, artifact flow, deployment controls, and observability.

## Stop conditions
Escalate when supply-chain integrity or production authorization cannot be guaranteed.