# Dependency and Platform Governance

## Purpose
Control dependency, framework, runtime, and platform choices so teams gain leverage without accumulating avoidable operational risk.

## When to use
Use when introducing libraries, frameworks, managed services, runtime upgrades, or shared platform standards.

## Inputs
Candidate dependency, maintenance history, license, security posture, compatibility, operational needs, alternatives.

## Context to inspect
Inspect current stack, support lifecycle, transitive dependencies, team expertise, deployment constraints, and upgrade history.

## Core knowledge
Every dependency creates lifecycle, security, compatibility, and operational obligations. Standardization has value, but unnecessary central control can slow teams.

## Procedure
1. Define the capability required.
2. Check whether existing platform capabilities already satisfy it.
3. Evaluate maturity, maintenance, security, licensing, and ecosystem fit.
4. Inspect transitive and runtime impact.
5. Prototype integration when risk is material.
6. Define ownership and upgrade policy.
7. Establish approved usage boundaries.
8. Automate vulnerability and lifecycle checks.
9. Plan migration before end-of-support.
10. Periodically remove unused dependencies.

## Decision points
Build when the capability is differentiating or external options create unacceptable constraints; buy/adopt when commodity capability is mature and supportable.

## Common failure patterns
Dependency for trivial convenience, abandoned packages, untracked licenses, pinned obsolete runtimes, and standards with no migration path.

## Verification
The choice has documented rationale, owner, support lifecycle, security checks, and upgrade strategy.

## Expected output
A governed dependency/platform decision with lifecycle responsibilities and boundaries.

## Stop conditions
Escalate for unacceptable licensing, unresolved critical vulnerabilities, or organization-wide platform commitments.