# Azure Landing Zone Design

## Purpose
Design a governed Azure foundation that lets workloads deploy safely without rebuilding identity, networking, policy, and operational controls for every project.

## When to use
Use when establishing a new Azure estate, onboarding subscriptions, separating environments, or correcting inconsistent cloud foundations. Do not redesign a stable landing zone without measurable need.

## Inputs
Business units, workload portfolio, tenant/subscription state, regulatory requirements, network dependencies, identity model, regions, budgets, and operational ownership.

## Preconditions
Confirm Azure tenant ownership, organizational boundaries, compliance constraints, and who can approve management-group or subscription changes.

## Context to inspect
Inspect management groups, subscriptions, Azure Policy assignments, RBAC, networking, DNS, logging, Defender settings, resource naming/tagging, budgets, and existing platform automation.

## Core knowledge
Landing zones separate platform concerns from workloads. Management groups provide governance inheritance; subscriptions are security, quota, billing, and blast-radius boundaries. Policy should enforce essential guardrails while avoiding controls that make delivery impractical.

## Procedure
1. Inventory tenants, management groups, subscriptions, and workload classes.
2. Define environment, ownership, compliance, and isolation boundaries.
3. Design the management-group hierarchy around governance needs rather than the org chart alone.
4. Define subscription vending and lifecycle rules.
5. Establish identity and privileged-access boundaries.
6. Define hub/spoke or virtual-WAN connectivity and DNS ownership where required.
7. Define mandatory policies, allowed exceptions, and remediation ownership.
8. Standardize diagnostic settings, security monitoring, tags, budgets, and resource locks where appropriate.
9. Encode the foundation with infrastructure as code.
10. Test onboarding with representative workloads before broad rollout.

## Decision points
Use separate subscriptions when isolation, quota, billing, policy, or ownership justify them. Prefer centralized shared services only when operational benefits exceed coupling and blast-radius risks.

## Common failure patterns
Mirroring the organization chart blindly, excessive policy denial, shared production/non-production subscriptions, unmanaged exceptions, manual subscription setup, and missing ownership metadata.

## Verification
Verify inheritance, RBAC boundaries, policy compliance, network reachability, centralized telemetry, budget alerts, and repeatable subscription onboarding in a non-production test.

## Expected output
A documented and automated Azure landing-zone foundation with explicit governance, ownership, connectivity, and onboarding rules.

## Stop conditions
Stop when tenant authority is unavailable, regulatory boundaries are unresolved, or the design would disrupt existing production connectivity without an approved migration plan.