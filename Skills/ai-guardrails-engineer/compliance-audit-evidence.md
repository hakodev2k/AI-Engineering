# Compliance and Audit Evidence

## Purpose
Produce trustworthy evidence of guardrail design, testing, operation, and change.

## When to use
Use for reviews, assurance, regulatory readiness, security assessment, audit.

## Inputs
Requirements, mappings, architecture, tests, releases, incidents, versions, metrics.

## Context to inspect
Inspect provenance, timestamps, owners, environments, exceptions, retention, operation.

## Core knowledge
Evidence should show operating effectiveness, not policy existence; separate design/execution evidence and minimize sensitive content.

## Procedure
1. Define control objective.
2. Map implementation/owner.
3. Collect design evidence.
4. Collect operating evidence.
5. Record exceptions/risk.
6. Verify time/environment.
7. Redact safely.
8. Sample continuous controls.
9. Reconcile docs/config.
10. Package limitations/sign-off.

## Decision points
Automate repeatable evidence; use attestation where judgment is necessary.

## Common failure patterns
Unproven screenshots, policy-as-proof, stale evidence, cherry-picking, hidden exceptions, sensitive copies.

## Verification
Independent reviewer traces claims to recent operation.

## Expected output
Traceable evidence package.

## Stop conditions
Do not claim effectiveness with missing/stale evidence.