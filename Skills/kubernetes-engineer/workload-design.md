# Workload Design

## Purpose
Design Deployments, StatefulSets, DaemonSets, Jobs, and CronJobs with correct lifecycle and failure behavior.

## When to use
Introducing or reviewing workloads on Kubernetes.

## Inputs
Runtime behavior, state model, scaling needs, startup/shutdown requirements, and scheduling constraints.

## Context to inspect
Manifests, images, controllers, probes, volumes, dependencies, and application lifecycle.

## Core knowledge
Controller choice encodes desired state and replacement semantics. Pods are disposable; applications must tolerate rescheduling and termination.

## Procedure
1. Determine stateless, stateful, node-local, batch, or scheduled behavior.
2. Select the appropriate controller.
3. Define replicas and update strategy.
4. Configure graceful termination and disruption behavior.
5. Define probes and resource requests.
6. Add scheduling and storage constraints only when justified.
7. Test restart, rollout, and node-loss behavior.

## Decision points
Use StatefulSet only when stable identity/order is required; Jobs for finite work; DaemonSets for node-scoped agents.

## Common failure patterns
Treating pods as VMs, storing local state accidentally, weak shutdown handling, mutable images, and unsuitable controllers.

## Verification
Exercise rollout, pod deletion, node drain, failed startup, and dependency loss; verify desired state recovers.

## Expected output
Production-ready workload manifests with documented lifecycle assumptions.

## Stop conditions
Stop when application behavior under restart or state loss is undefined.