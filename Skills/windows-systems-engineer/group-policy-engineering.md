# Group Policy Engineering

## Purpose
Design, deploy, troubleshoot, and govern Group Policy without creating opaque inheritance or broad unintended impact.

## When to use
Use for domain-managed Windows configuration, security baselines, policy troubleshooting, or GPO consolidation.

## Inputs
Desired settings, target users/computers, OU topology, existing GPOs, security/WMI filters, inheritance, exceptions, and validation cohort.

## Preconditions
Know the target scope and have a test population. Export or otherwise preserve existing GPO state before material changes.

## Context to inspect
OU hierarchy, linked GPOs, enforced/block inheritance settings, security filtering, WMI filters, loopback mode, central ADMX store, `gpresult`, GroupPolicy operational logs, and replication health.

## Core knowledge
Policy outcome is a composition of local, site, domain, OU processing plus filtering and precedence. Computer and user policy differ; loopback changes user processing semantics. GPO design should optimize clarity, ownership, testability, and blast-radius control.

## Procedure
1. Translate the requirement into explicit policy settings and targets.
2. Check whether an existing GPO already owns the setting.
3. Model inheritance and filtering before creating anything new.
4. Prefer focused, purpose-named GPOs over monolithic policy collections.
5. Stage changes on a representative test OU or filtered group.
6. Generate resultant-set evidence before and after application.
7. Validate processing logs and actual registry/security behavior.
8. Expand scope progressively when risk warrants.
9. Remove obsolete links or settings only after dependency review.
10. Document ownership, rationale, exceptions, and rollback.

## Decision points
Use security filtering for stable identity-based targeting; use WMI filters sparingly because they add processing cost and complexity. Use loopback only where computer location must determine user policy.

## Common failure patterns
Duplicate ownership of the same setting, overusing enforced/block inheritance, broad production linking without staging, slow WMI filters, stale ADMX assumptions, and trusting GPMC configuration without checking resultant policy.

## Verification
Verify `gpresult`/RSoP, policy processing events, target setting state, representative user/computer behavior, and absence of unintended policy on control systems.

## Expected output
A minimally scoped, explainable GPO change with evidence of resultant behavior.

## Stop conditions
Stop when inheritance is not understood, the target scope cannot be bounded, policy replication is unhealthy, or a security-impacting baseline exception lacks approval.