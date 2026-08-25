# Security Testing and Validation

## Purpose
Prove database security controls work as designed rather than relying on configuration intent.

## When to use
Use after control changes, before production launch, during assurance reviews, or after incidents.

## Inputs
Threat model, control requirements, test identities, schemas, network paths, audit rules, and safe test environment.

## Context to inspect
Identify production constraints, representative roles, sensitive objects, failover paths, and existing automated tests.

## Core knowledge
Security validation requires positive and negative cases. Effective permissions and runtime behavior matter more than declarative configuration. Tests should avoid destructive payloads in production.

## Procedure
1. Convert requirements and threats into testable assertions.
2. Prioritize authentication, authorization, segmentation, encryption, audit, injection resistance, and recovery controls as applicable.
3. Create representative low-, normal-, and high-privilege identities.
4. Test allowed operations.
5. Test denied cross-role, cross-tenant, and network paths.
6. Verify audit evidence for both outcomes.
7. Test failover or alternate paths where safe.
8. Automate stable assertions.
9. Record evidence, gaps, and remediation owners.

## Decision points
Use production testing only for non-destructive assertions with explicit authorization. Use staging for intrusive or failure-mode tests.

## Common failure patterns
Testing only successful access, relying on screenshots, missing effective inherited privileges, destructive scanning, and tests that bypass real connection paths.

## Verification
Re-run assertions after remediation and preserve reproducible evidence with timestamps and versions.

## Expected output
A repeatable security test suite and evidence-backed control assessment.

## Stop conditions
Stop tests that threaten availability, data integrity, or exceed authorization; escalate critical control failures.