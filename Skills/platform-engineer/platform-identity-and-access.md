# Platform Identity and Access

## Purpose
Design least-privilege identity for developers, workloads, automation, and platform operators.

## When to use
Use when platform capabilities cross cloud, cluster, repository, deployment, or secret boundaries.

## Inputs
Actors, resources, roles, identity providers, trust boundaries, and audit requirements.

## Context to inspect
SSO, RBAC, service accounts, workload identity, tokens, elevation paths, and audit logs.

## Core knowledge
Prefer short-lived federated identity over static credentials. Separate human, workload, and automation identities and constrain privileges by task and environment.

## Procedure
1. Inventory actors and privileged actions.
2. Define resource and environment boundaries.
3. Map roles to minimum permissions.
4. Use federation and workload identity where supported.
5. Remove shared and long-lived credentials.
6. Add controlled elevation for exceptional operations.
7. Log sensitive authorization decisions.
8. Periodically review and revoke unused access.

## Decision points
Use coarse roles only when blast radius remains acceptable; introduce finer roles where privilege concentration creates material risk.

## Common failure patterns
Shared accounts, permanent admin, wildcard permissions, credential copying, and authorization embedded inconsistently in tools.

## Verification
Test allowed and denied paths, token lifetime, revocation, auditability, and environment isolation.

## Expected output
An identity model with roles, trust relationships, elevation, audit, and review procedures.

## Stop conditions
Escalate when required access exceeds approved boundaries or identity ownership is unclear.