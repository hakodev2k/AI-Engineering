# Cloud Network Security

## Purpose
Secure cloud network connectivity using native controls, explicit trust boundaries, private service access, and observable routing.

## When to use
Use for VPC/VNet design, cloud migration, peering, private endpoints, hybrid connectivity, or cloud network reviews.

## Inputs
Cloud architecture, accounts/subscriptions, workloads, connectivity requirements, identity model, data sensitivity.

## Context to inspect
VPC/VNet, subnets, routes, security groups/NSGs, cloud firewalls, load balancers, private endpoints, gateways, flow logs.

## Core knowledge
Shared responsibility, software-defined networking, stateful security groups, route propagation, transit hubs, private service connectivity, cloud-native DNS.

## Procedure
1. Map accounts, networks, trust zones, and owners.
2. Identify required north-south and east-west flows.
3. Minimize public exposure.
4. Apply workload-level and boundary controls.
5. Secure hybrid/transit routing.
6. Prefer private service endpoints where appropriate.
7. Enable flow and control-plane logs.
8. Validate failover and policy behavior with cloud-native tools.

## Decision points
Centralize inspection for governance where routing complexity remains manageable; distribute controls when workload autonomy and scale dominate.

## Common failure patterns
Overbroad security groups, accidental public routes, transitive peering assumptions, hidden egress, duplicated controls with inconsistent policy.

## Verification
Use reachability analysis, flow logs, configuration checks, and application tests for allowed and denied paths.

## Expected output
Cloud network security design, policy set, route model, validation evidence, operational ownership.

## Stop conditions
Escalate cross-account ownership ambiguity, public exposure without approval, or route changes with uncontrolled blast radius.