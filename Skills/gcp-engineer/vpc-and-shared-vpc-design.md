# VPC and Shared VPC Design

## Purpose
Design secure, scalable GCP network topology using VPCs, Shared VPC, subnets, routes, firewall policies, private access, and hybrid connectivity.

## When to use
Use for multi-project networking, network segmentation, centralized platform ownership, or connectivity redesign.

## Inputs
Workload locations, IP ranges, tenancy model, connectivity needs, security zones, DNS requirements, and growth projections.

## Context to inspect
Existing VPCs, subnet allocation, routes, firewall rules, NAT, Private Google Access, Private Service Connect, Cloud Router, VPN, Interconnect, and DNS.

## Core knowledge
GCP VPCs are global while subnets are regional. Shared VPC separates network ownership from workload projects. Address planning and route domains become expensive to change later.

## Procedure
1. Identify network trust and ownership boundaries.
2. Allocate non-overlapping address space with growth headroom.
3. Decide host and service project structure.
4. Design regional subnets by workload class.
5. Define ingress, egress, and east-west controls.
6. Configure private access paths to Google APIs and services.
7. Plan hybrid connectivity and route advertisement.
8. Define DNS architecture.
9. Validate failover, NAT capacity, and route propagation.
10. Codify and test the topology.

## Decision points
Use Shared VPC when centralized networking serves many projects. Use separate VPCs when trust, route, or administrative isolation outweighs connectivity simplicity.

## Common failure patterns
Overlapping CIDRs, broad firewall rules, uncontrolled default networks, brittle peering meshes, and hidden dependence on public IPs.

## Verification
Run connectivity tests, inspect effective routes/firewalls, validate private access, and simulate link failure.

## Expected output
A network architecture with explicit isolation, routing, and ownership.

## Stop conditions
Stop if IP ownership or hybrid route domains are unknown.