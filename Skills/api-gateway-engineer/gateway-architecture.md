# Gateway Architecture

## Purpose
Design an API gateway boundary that centralizes cross-cutting traffic policy without turning the gateway into a business-logic monolith.

## When to use
Use when introducing, replacing, or restructuring an API gateway, ingress layer, or edge proxy.

## Inputs
Service topology, protocols, traffic patterns, NFRs, security requirements, deployment model.

## Context to inspect
Existing ingress, service ownership, discovery model, authentication path, network boundaries, latency SLOs, failure domains.

## Core knowledge
Understand L4 vs L7 routing, reverse proxies, control plane/data plane separation, statelessness, failure isolation, policy placement, east-west vs north-south traffic, and managed vs self-hosted gateways.

## Procedure
1. Identify consumers and protected backends.
2. Map trust boundaries and traffic paths.
3. Classify policies as edge, gateway, or service responsibilities.
4. Define route ownership and configuration source of truth.
5. Design HA, scaling, and failure behavior.
6. Define observability and audit requirements.
7. Establish safe config rollout and rollback.
8. Validate architecture against latency, availability, and security objectives.

## Decision points
Prefer a thin gateway when domain logic can remain in services. Choose centralized policy only for concerns that benefit from consistent enforcement. Managed gateways reduce operations burden; self-hosted gateways provide deeper control.

## Common failure patterns
Business logic in gateway plugins; shared mutable state; hidden routing rules; single-region dependency; config drift; unbounded plugin chains.

## Verification
Run architecture review, failure-mode analysis, representative traffic tests, and rollback exercises.

## Expected output
Documented gateway topology, responsibilities, policy boundaries, scaling model, and operational controls.

## Stop conditions
Escalate when ownership, trust boundaries, or required availability targets are undefined.