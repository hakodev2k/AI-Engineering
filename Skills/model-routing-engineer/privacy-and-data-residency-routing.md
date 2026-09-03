# Privacy and Data Residency Routing

## Purpose
Ensure requests are routed only to providers, deployments, and regions allowed for the request's data classification and jurisdiction.

## When to use
Use when workloads include personal, confidential, regulated, tenant-restricted, or residency-constrained data.

## Inputs
Data classification, tenant policy, region, provider processing terms, retention settings, deployment locations, legal requirements.

## Context to inspect
Request metadata, storage and logging paths, provider agreements, regional endpoints, subprocessors, retention controls, and fallback policies.

## Core knowledge
Residency and privacy restrictions are hard constraints that must apply to primary routes, retries, fallbacks, telemetry, and support tooling. Routing metadata itself can contain sensitive information.

## Procedure
1. Define enforceable data classes and jurisdiction attributes.
2. Map providers and regions to allowed processing conditions.
3. Filter candidate routes before quality/cost optimization.
4. Verify logging, caching, and tracing follow the same boundary.
5. Configure compliant regional fallbacks only.
6. Record policy version and reason code with minimal sensitive metadata.
7. Test cross-region and fallback boundary cases.
8. Revalidate provider terms and deployment topology periodically.

## Decision points
Fail closed when classification or residency is uncertain for regulated data. Prefer dedicated deployments when shared-provider controls cannot satisfy contractual requirements.

## Common failure patterns
Compliant primary route with noncompliant fallback, storing prompts in global telemetry, trusting region labels without validating processing location, and missing tenant-specific restrictions.

## Verification
Verify policy tests, infrastructure region mapping, log destinations, fallback behavior, and audit evidence for representative tenants.

## Expected output
A privacy-aware eligibility policy with region/provider mappings, audit reasons, and tested failure behavior.

## Stop conditions
Stop when legal interpretation, data classification, or provider processing location is unresolved.