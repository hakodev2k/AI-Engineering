# Scanner Orchestration and Triage

## Purpose
Use automated scanners as efficient coverage amplifiers while controlling noise, operational impact, and false-positive reporting.

## When to use
Use for broad authorized discovery, repeatable checks, regression validation, and coverage support across web, network, cloud, or dependencies.

## Inputs
Scope, scanner capabilities, templates/plugins, credentials when approved, rate constraints, exclusions, and target criticality.

## Context to inspect
Inspect scanner safety characteristics, request volume, intrusive checks, authentication behavior, target fragility, and prior known findings.

## Core knowledge
Scanners generate hypotheses. Template quality, target context, authentication, version detection, and environmental mitigations determine whether an alert is meaningful. Tool output must never replace validation.

## Procedure
1. Select scanners based on assessment objective and protocol.
2. Restrict targets to an explicit allowlist.
3. Disable destructive or unsuitable checks.
4. Configure conservative rate/concurrency for the environment.
5. Add approved authentication where it improves coverage safely.
6. Run a small sample and inspect operational effects.
7. Execute broader scan within limits.
8. Deduplicate alerts by root cause and asset.
9. Prioritize by exploitability and business context.
10. Manually validate candidates before reporting.

## Decision points
Choose authenticated scanning when it materially improves coverage and credential handling is safe. Prefer targeted templates over massive generic sets on fragile systems.

## Common failure patterns
Reporting raw scanner output, scanning out of scope, default high concurrency, stale templates, trusting version banners, and ignoring authentication failures.

## Verification
Confirm target allowlist, review scanner logs/errors, manually validate reported issues, and check that critical expected surfaces were actually scanned.

## Expected output
A triaged candidate set with scan coverage, exclusions, confidence, validation status, and no unverified findings presented as vulnerabilities.

## Stop conditions
Stop scanning on instability, unexpected scope expansion, excessive load, or scanner behavior inconsistent with approved techniques.