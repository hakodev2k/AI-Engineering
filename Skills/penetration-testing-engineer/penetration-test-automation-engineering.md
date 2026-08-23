# Penetration Test Automation Engineering

## Purpose
Build small, safe, reusable automation that improves assessment coverage, reproducibility, and evidence quality without turning engagement scripts into uncontrolled exploitation tooling.

## When to use
Use for repetitive request generation, asset normalization, permission matrices, evidence processing, safe regression checks, and protocol-specific validation.

## Inputs
Assessment objective, authorized targets, protocol/API details, sample traffic, rate limits, test identities, and expected evidence.

## Context to inspect
Inspect target allowlists, authentication handling, destructive operations, retry behavior, concurrency, output sensitivity, and cleanup requirements.

## Core knowledge
Security automation should fail closed, be target-bounded, deterministic, observable, and conservative by default. Human review remains necessary for ambiguous security conclusions.

## Procedure
1. Define the narrow security question to automate.
2. Separate target/configuration inputs from code.
3. Require explicit allowlisted targets.
4. Add conservative timeout, retry, concurrency, and request limits.
5. Avoid destructive defaults and automatic exploit chaining.
6. Protect credentials from logs and source control.
7. Emit structured evidence with timestamps and target context.
8. Test against a controlled environment first.
9. Review false-positive/false-negative modes.
10. Document safe usage, cleanup, and limitations.

## Decision points
Automate deterministic mechanics, not judgment-heavy conclusions. Prefer existing trusted tooling when custom code adds maintenance or safety risk without unique value.

## Common failure patterns
Hardcoded secrets, wildcard targets, unlimited concurrency, automatic state mutation, swallowing errors, ambiguous output, and treating a match as a confirmed vulnerability.

## Verification
Run against known-positive and known-negative cases, inspect rate/safety behavior, and manually validate representative results.

## Expected output
A bounded assessment utility plus usage constraints and evidence format that supports human validation.

## Stop conditions
Stop development if the requested automation requires unauthorized targeting, uncontrolled propagation, persistence, credential theft, or destructive behavior.