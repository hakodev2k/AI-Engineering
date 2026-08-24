# Multi-Account Cloud Governance

## Purpose
Design organization-level cloud guardrails that constrain risk while preserving team autonomy.

## When to use
Use for landing zones, account/subscription/project hierarchy, organization policies, or governance redesign.

## Inputs
Organization structure, environments, regulatory boundaries, identity model, network architecture, logging, and platform ownership.

## Context to inspect
Inspect hierarchy inheritance, organization policies, central security accounts, billing, federation, break-glass access, and exception mechanisms.

## Core knowledge
Strong governance separates workloads, centralizes critical security services, and enforces non-negotiable controls at the highest practical scope.

## Procedure
1. Define isolation and ownership boundaries.
2. Separate production, non-production, security, and shared services appropriately.
3. Centralize identity federation and audit logging.
4. Define organization-level preventive guardrails.
5. Establish secure baseline accounts/projects.
6. Restrict root/owner-level credentials.
7. Create controlled exception workflow.
8. Automate account vending and baseline validation.
9. Test inherited policy behavior and recovery access.

## Decision points
Enforce invariants centrally; delegate service-specific controls to teams. Separate accounts when blast-radius, billing, policy, or compliance boundaries justify it.

## Common failure patterns
One giant account, inconsistent baselines, central teams owning every application permission, hidden policy inheritance, and permanent exceptions.

## Verification
Provision a representative new account/project and prove baseline, logging, identity, and guardrails apply automatically.

## Expected output
Governed cloud hierarchy with automated baselines, explicit ownership, and auditable exceptions.

## Stop conditions
Escalate policy changes that could lock out administrators or disrupt many workloads without tested recovery.