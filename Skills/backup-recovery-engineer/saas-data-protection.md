# SaaS Data Protection

## Purpose
Protect business-critical SaaS data beyond provider availability guarantees and native recycle-bin capabilities.

## When to use
Use for collaboration, CRM, ticketing, source control, identity, or other SaaS platforms containing critical records or configuration.

## Inputs
SaaS inventory, provider retention/export capabilities, APIs, business criticality, compliance needs, identity model, and recovery scenarios.

## Context to inspect
Inspect provider shared-responsibility terms, deletion retention, version history, export scope, API quotas, metadata/configuration coverage, and tenant-admin dependencies.

## Core knowledge
High provider durability does not necessarily protect against tenant deletion, malicious changes, retention expiry, or account compromise. Recovery may require preserving relationships and metadata, not just file content.

## Procedure
1. Identify critical SaaS datasets and configuration.
2. Review provider-native recovery guarantees and exclusions.
3. Define independent export/backup requirements.
4. Capture metadata, permissions, relationships, and audit data where needed.
5. Separate backup credentials from normal tenant administration.
6. Respect API limits and incremental-change semantics.
7. Encrypt and retain exports according to classification.
8. Test granular and bulk restore workflows.
9. Validate restored permissions and relationships.
10. Monitor backup coverage after SaaS schema/API changes.

## Decision points
Native recovery may suffice for low-criticality data with generous retention; independent backup is justified when deletion, compliance, or tenant compromise risk exceeds native coverage.

## Common failure patterns
Exporting content without permissions; backup app has excessive privileges; API throttling creates hidden RPO gaps; provider API changes silently reduce coverage.

## Verification
Perform sampled restores and reconcile object counts, metadata, permissions, and timestamps against source expectations.

## Expected output
Documented and tested SaaS recovery coverage aligned to shared responsibility.

## Stop conditions
Escalate when provider APIs cannot export required data, contractual restrictions prevent backup, or restore would violate tenant governance.