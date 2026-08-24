# Data Product Governance

## Purpose
Apply governance to data products while preserving domain autonomy and product delivery speed.

## When to use
Use in data mesh/product operating models, self-service platforms, or when datasets are treated as reusable products.

## Inputs
Product definition, consumers, domain ownership, classifications, contracts, quality SLOs, platform controls, lifecycle state.

## Context to inspect
Inspect product boundaries, discoverability, support model, dependencies, consumer usage, platform guardrails, and deprecation practices.

## Core knowledge
A governed data product needs accountable ownership, clear purpose, trustworthy semantics, discoverability, interoperability, security, quality, observability, and lifecycle management. Governance should be policy-as-code where practical.

## Procedure
1. Define minimum product governance criteria.
2. Identify owner, consumers, purpose, and domain.
3. Require metadata, glossary links, classification, and lineage.
4. Define contract and quality/service SLOs.
5. Apply access and retention controls.
6. Establish interoperability and naming standards.
7. Automate conformance checks in platform workflows.
8. Define support, incident, change, and deprecation processes.
9. Measure adoption, reliability, and governance conformance.
10. Periodically recertify active products and retire unused ones.

## Decision points
Use platform guardrails for universal controls and domain discretion for context-specific semantics. Increase assurance with product criticality and consumer breadth.

## Common failure patterns
Calling raw tables products, no consumer contract, governance as manual gate, ownerless products, no deprecation, and global standards that erase useful domain context.

## Verification
Onboard a representative product and confirm automated/manual controls, discoverability, contract tests, access, SLO monitoring, and lifecycle workflows operate end to end.

## Expected output
Product governance standard, conformance checks, ownership, SLOs, lifecycle, and evidence requirements.

## Stop conditions
Escalate products that cannot meet mandatory security/regulatory controls or lack accountable ownership.