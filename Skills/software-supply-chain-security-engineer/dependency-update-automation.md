# Secure Dependency Update Automation

## Purpose
Automate dependency updates while preserving review quality, provenance, compatibility, and resistance to malicious or accidental upstream releases.

## When to use
Use when configuring dependency bots, reducing patch latency, or improving stale dependency backlogs.

## Inputs
Package manifests, lockfiles, update tooling, test suites, release policy, dependency criticality, and package-source controls.

## Context to inspect
Inspect update cadence, grouping, auto-merge rules, lockfile behavior, CI permissions, registry trust, changelog/release metadata, and rollback capability.

## Core knowledge
Automation reduces exposure time but can accelerate malicious updates. Safe automation uses immutable resolution, constrained permissions, staged adoption, strong tests, and differentiated policies by risk.

## Procedure
1. Classify dependencies by runtime impact and trust.
2. Configure authenticated approved registries.
3. Require lockfile-consistent updates.
4. Separate security updates from routine upgrades where useful.
5. Limit bot permissions to required repository actions.
6. Require CI validation and policy checks.
7. Auto-merge only low-risk changes with high-confidence tests and explicit policy.
8. Hold or manually review high-impact ecosystem changes.
9. Monitor publisher ownership and suspicious release patterns.
10. Measure update latency, rollback rate, and exception age.

## Decision points
Grouping reduces review load but can obscure which update caused failure. Auto-merge is appropriate only where test strength and dependency risk justify it.

## Common failure patterns
Auto-merging every patch version; bot tokens with broad write access; ignoring major transitive changes; stale lockfiles; no rollback path; update floods that reviewers rubber-stamp.

## Verification
Run updates in clean CI, inspect resolved graphs, confirm source origin, execute regression/security tests, and verify production artifact versions after release.

## Expected output
A controlled update pipeline balancing patch speed with integrity and compatibility.

## Stop conditions
Escalate on suspicious upstream releases, ownership transfers, widespread test failure, or required upgrades with material breaking/security trade-offs.