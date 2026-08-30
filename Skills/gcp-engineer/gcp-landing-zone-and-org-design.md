# GCP Landing Zone and Organization Design

## Purpose
Design a scalable Google Cloud organization, folder, project, identity, policy, billing, and network foundation that supports multiple teams without losing governance.

## When to use
Use for new GCP estates, major reorganizations, acquisitions, environment separation, or when project sprawl and inconsistent controls create operational risk.

## Inputs
Business units, environments, regulatory constraints, IAM model, billing ownership, network topology, deployment model, and existing organization policies.

## Preconditions
Administrative sponsorship exists and critical ownership boundaries are known.

## Context to inspect
Current resource hierarchy, IAM inheritance, organization policies, billing accounts, Shared VPCs, service perimeters, naming conventions, and deployment pipelines.

## Core knowledge
GCP policy and IAM inherit through organization, folders, and projects. Folder design should encode durable governance boundaries rather than short-lived team structures. Projects are isolation, quota, billing, and lifecycle units.

## Procedure
1. Identify governance and isolation requirements.
2. Model organization and folder boundaries.
3. Define project lifecycle and naming standards.
4. Establish billing ownership and budget controls.
5. Define centralized networking and DNS ownership.
6. Apply baseline organization policies.
7. Define identity groups and privileged roles.
8. Establish logging, asset inventory, and security aggregation.
9. Automate provisioning through approved IaC.
10. Validate inheritance and exception paths.

## Decision points
Use separate folders for materially different policy domains. Use separate projects when quota, lifecycle, billing, blast radius, or IAM isolation justify it.

## Common failure patterns
Flat organizations, direct user bindings, manually created projects, inconsistent labels, excessive policy exceptions, and networking that couples unrelated workloads.

## Verification
Provision a representative project, inspect inherited policies and IAM, validate billing/logging/network attachment, and confirm teardown is automated.

## Expected output
A documented and reproducible landing-zone architecture.

## Stop conditions
Stop when organization ownership, regulatory boundaries, or privileged access responsibilities are unresolved.