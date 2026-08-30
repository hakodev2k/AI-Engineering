# Compute Engine and Managed Instance Groups

## Purpose
Design and operate VM-based workloads using Compute Engine, instance templates, managed instance groups, autoscaling, and image lifecycle controls.

## When to use
Use when workloads require VM-level control, specialized drivers, legacy software, or predictable host behavior.

## Inputs
CPU/memory profile, image requirements, availability target, state model, storage needs, licensing, and network dependencies.

## Context to inspect
Machine types, instance templates, MIG policies, health checks, disks, startup scripts, Shielded VM settings, OS patching, and autoscaler configuration.

## Core knowledge
MIGs provide declarative fleet management and repair. Immutable images/templates reduce drift. Stateful VMs require deliberate disk and identity handling.

## Procedure
1. Confirm VM hosting is justified.
2. Select machine family from workload measurements.
3. Build immutable image or startup configuration.
4. Create instance templates with least-privilege service accounts.
5. Configure regional MIG when availability requires it.
6. Define health checks and autohealing.
7. Configure autoscaling with safe bounds.
8. Plan patching and template rollout.
9. Test replacement and zone failure.

## Decision points
Use custom machine types when utilization data supports it. Prefer regional MIGs for resilient stateless services.

## Common failure patterns
Pet VMs, manual configuration drift, broad service account scopes, state stored on ephemeral boot disks, and autoscaling on noisy metrics.

## Verification
Replace instances deliberately, inspect image provenance, validate scaling and recovery, and confirm no manual-only steps exist.

## Expected output
A reproducible, self-healing VM fleet.

## Stop conditions
Stop if workload state cannot survive instance replacement without an approved stateful design.