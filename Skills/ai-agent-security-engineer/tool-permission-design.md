# Tool Permission Design

## Purpose
Design least-privilege permissions for agent tools so model errors or adversarial instructions cannot automatically become high-impact system actions.

## When to use
Use when adding tools, expanding tool scopes, introducing new credentials, or reviewing an agent with broad API access.

## Inputs
Tool inventory, API scopes, identities, action taxonomy, resource boundaries, and business criticality.

## Preconditions
Know the minimum legitimate actions and resources required by each workflow.

## Context to inspect
Service accounts, OAuth scopes, API tokens, tool gateways, resource filters, environment separation, network paths, and approval mechanisms.

## Core knowledge
A model should not inherit ambient authority. Capabilities should be explicit, narrowly scoped, revocable, observable, and ideally short-lived. Authorization belongs outside model reasoning.

## Procedure
1. Inventory every callable tool and operation.
2. Classify operations as read, write, delete, execute, transfer, or administrative.
3. Map each workflow to minimum required operations and resources.
4. Split broad tools into narrower capabilities where practical.
5. Use distinct identities for materially different privilege sets.
6. Prefer short-lived delegated credentials over static broad secrets.
7. Enforce resource and tenant boundaries deterministically.
8. Add per-action policy checks and parameter constraints.
9. Gate irreversible or high-risk operations with approval.
10. Define revocation and emergency-disable paths.
11. Log identity, requested action, policy result, and outcome.
12. Re-test least privilege after workflow changes.

## Decision points
Use separate credentials when compromise impact or audit requirements differ. Prefer server-side resource constraints over model-generated filters.

## Common failure patterns
One service account for every tool, wildcard scopes, credentials embedded in prompts, authorization based on model prose, and missing tenant checks.

## Verification
Demonstrate that unauthorized resources and operations fail even when explicitly requested by the model. Verify legitimate paths still succeed.

## Expected output
A permission matrix, constrained tool contracts, credential strategy, approval rules, and negative authorization tests.

## Stop conditions
Escalate if the external system cannot express required least privilege or if production credentials must be exposed directly to the model.