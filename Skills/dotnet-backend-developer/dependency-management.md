# Dependency Management

## Purpose
Select, upgrade, and govern NuGet/framework dependencies while controlling security, licensing, compatibility, and maintenance risk.

## When to use
Adding libraries, framework upgrades, CVE remediation, replacing abandoned/commercial packages.

## Inputs
Use case, candidate packages, license, release history, advisories, compatibility, transitive graph.

## Context to inspect
Central package management, lock files, transitive dependencies, target frameworks, package ownership/health, existing alternatives.

## Core knowledge
Every dependency adds supply-chain and upgrade surface. Prefer platform features or mature focused libraries when they reduce more complexity than they add.

## Procedure
1. Define exact capability needed.
2. Check if .NET/framework already provides it.
3. Evaluate maintainer health, update cadence, adoption, issues, security history, license.
4. Inspect transitive dependencies.
5. Prototype compatibility/performance where relevant.
6. Pin/manage versions consistently.
7. Add tests around library-specific behavior.
8. Plan upgrade cadence and replacement path for critical dependencies.

## Decision points
Build in-house only when requirements are narrow/stable and dependency risk outweighs maintenance cost. Avoid broad frameworks for tiny capabilities.

## Common failure patterns
Package for trivial helper, ignoring license changes, wildcard versions, direct reliance on unstable internals, no upgrade tests.

## Verification
Clean restore/build/test, license/security scan, representative runtime test.

## Expected output
A justified, governable dependency choice.

## Stop conditions
Escalate unclear licensing, critical unresolved CVEs, or packages requiring privileged native components.