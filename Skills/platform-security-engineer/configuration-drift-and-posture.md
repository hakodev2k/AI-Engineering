# Configuration Drift and Security Posture

## Purpose
Continuously detect and remediate drift between approved platform security baselines and actual deployed configuration across control planes, runtimes, cloud resources, and shared services.

## When to use
Use when standardizing platform baselines, investigating configuration regressions, validating infrastructure-as-code adoption, or reducing manually introduced security exceptions.

## Inputs
Approved baselines, infrastructure code, runtime inventories, policy rules, cloud or cluster configuration, ownership metadata, change history, and exception records.

## Context to inspect
Inspect live configuration rather than repository intent alone. Review IAM, network rules, encryption settings, runtime privileges, admission policy, logging, backup settings, public exposure, service accounts, and manually changed resources.

## Core knowledge
Declarative infrastructure does not guarantee runtime conformance. Drift can result from emergency changes, console edits, failed automation, provider defaults, stale resources, or policy exceptions. Detection must distinguish harmless variance from security-significant divergence.

## Procedure
1. Define security-relevant baseline controls and authoritative desired state.
2. Inventory resources and map them to owners and environments.
3. Compare live configuration with desired state.
4. Classify drift by security impact, exploitability, and blast radius.
5. Identify whether drift came from approved exception, automation failure, manual change, or unmanaged resource.
6. Remediate high-risk drift using the normal deployment path where possible.
7. Import or remove unmanaged resources rather than leaving shadow infrastructure.
8. Convert recurring drift patterns into preventive policy or safer defaults.
9. Require owner, rationale, and expiry for intentional exceptions.
10. Monitor security posture trends and unresolved drift age.
11. Validate remediation in live state, not only in code review.
12. Review whether the baseline itself remains appropriate after major platform changes.

## Decision points
Auto-remediate only deterministic, well-understood drift with low availability risk. Require review for changes that could interrupt traffic, revoke access, delete state, or alter recovery paths.

## Common failure patterns
Assuming infrastructure-as-code means no drift, alerting on every cosmetic difference, auto-remediating destructive settings, permanent exceptions, and scanning only cloud resources while ignoring platform application configuration.

## Verification
Verify live resources match approved policy after remediation, intentional exceptions are current, high-risk unmanaged assets are eliminated, and recurrence is reduced through preventive controls.

## Expected output
A measurable security-posture baseline, prioritized drift findings, verified remediation, and controls that reduce future divergence.

## Stop conditions
Stop and escalate when remediation is destructive, ownership is unknown, drift may be incident-related, or the desired state conflicts with evidence required for safe production operation.