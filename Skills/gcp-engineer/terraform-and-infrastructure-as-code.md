# Terraform and Infrastructure as Code

## Purpose
Manage GCP resources through reproducible, reviewable infrastructure as code with controlled state, modules, policy checks, and change workflows.

## When to use
Use for platform provisioning, standardized project creation, environment replication, or drift remediation.

## Inputs
Target resources, ownership boundaries, environments, state backend, CI/CD system, and approval policy.

## Context to inspect
Terraform modules, providers, state configuration, imports, workspaces, plan pipeline, policy checks, and manually managed resources.

## Core knowledge
Terraform state is sensitive operational data. Module boundaries should follow lifecycle and ownership boundaries, not arbitrary resource count.

## Procedure
1. Inventory existing managed and unmanaged resources.
2. Define state boundaries by blast radius and ownership.
3. Pin provider/module versions deliberately.
4. Build small composable modules with explicit inputs/outputs.
5. Import existing resources before assuming ownership.
6. Run fmt, validate, lint, and policy checks.
7. Produce reviewed plans in CI.
8. Apply from controlled automation.
9. Detect drift periodically.
10. Test module upgrades in non-production first.

## Decision points
Split state when teams, lifecycle, permissions, or blast radius differ. Avoid workspaces as a substitute for strong environment isolation when risks differ materially.

## Common failure patterns
Shared giant state, manual console changes, secrets in state outputs, unpinned providers, and destructive refactors without moved/import blocks.

## Verification
Run clean plan after apply, inspect state access controls, and recreate a representative environment from code.

## Expected output
Auditable GCP infrastructure managed through IaC.

## Stop conditions
Stop before destructive plans whose data-loss or outage impact is not approved.