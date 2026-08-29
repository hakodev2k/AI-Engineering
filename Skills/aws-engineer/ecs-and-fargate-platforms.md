# ECS and Fargate Platforms

## Purpose
Design and operate containerized workloads on Amazon ECS and Fargate with safe deployments, scaling, and service isolation.

## When to use
Use for managed container platforms where Kubernetes is unnecessary or operational simplicity is preferred.

## Inputs
Container image, CPU/memory, ports, scaling model, secrets, networking, deployment strategy, persistent-storage requirements.

## Context to inspect
Clusters, task definitions, services, capacity providers, ALB/NLB, service discovery, IAM task roles, logs, ECR, autoscaling.

## Core knowledge
Task execution roles and task roles serve different purposes. Fargate simplifies infrastructure; EC2-backed ECS offers more instance-level control. Deployments must account for health-check timing and connection draining.

## Procedure
1. Define task resource requirements from measurement.
2. Separate execution-role and workload permissions.
3. Configure awsvpc networking and least-privilege security groups.
4. Store secrets in managed secret stores, not images.
5. Configure health checks and startup grace periods.
6. Choose rolling or blue/green deployment based on risk.
7. Define autoscaling on meaningful demand signals.
8. Configure centralized logs and service metrics.
9. Test task replacement, AZ loss, and rollback.

## Decision points
Choose Fargate for reduced host operations; EC2 capacity providers for specialized hardware, daemon workloads, or tighter unit economics at scale.

## Common failure patterns
CPU/memory guesses, broad task roles, health checks that kill slow starts, mutable latest tags, no drain handling, and scaling on CPU when demand is queue-based.

## Verification
Run deployment/rollback tests, failure replacement, scale tests, permission checks, and image provenance checks.

## Expected output
Task/service architecture, deployment model, scaling policy, and operational runbook.

## Stop conditions
Escalate when workloads require unsupported kernel/host features or persistent local state prevents safe rescheduling.