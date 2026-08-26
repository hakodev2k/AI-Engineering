# PowerShell Automation

## Purpose
Build safe, idempotent, observable PowerShell automation for Windows administration at fleet scale.

## When to use
Use for repeatable configuration, inventory, remediation, provisioning, reporting, or operational workflows.

## Inputs
Desired state, target inventory, PowerShell edition/version, module dependencies, identity model, remoting constraints, error policy, and output requirements.

## Preconditions
Test against non-production targets and define privilege boundaries. Never embed credentials or secrets in scripts.

## Context to inspect
Existing scripts/modules, execution environment, remoting configuration, module versions, Constrained Language Mode, logging, code-signing policy, and automation runner behavior.

## Core knowledge
Prefer objects over text parsing, advanced functions over ad hoc scripts, explicit error handling, predictable exit semantics, and idempotent operations. Understand pipeline behavior, scopes, remoting serialization, `ShouldProcess`, structured logging, and secret-safe authentication.

## Procedure
1. Define the desired end state and failure contract.
2. Discover current state before mutating it.
3. Design operations to be safe on repeated execution.
4. Use parameter validation and explicit types where they prevent ambiguity.
5. Use `-ErrorAction Stop` selectively with `try/catch/finally` around recoverable boundaries.
6. Support `-WhatIf`/`-Confirm` for destructive operations where practical.
7. Emit structured objects and actionable logs rather than presentation-only text.
8. Handle remote, offline, and partially failed targets independently.
9. Test success, no-op, malformed input, permission failure, and partial-failure paths.
10. Version and document dependencies and operational usage.

## Decision points
Use PowerShell remoting for Windows-native management when available; use platform APIs or configuration-management tooling when they provide stronger desired-state guarantees. Parallelize only after understanding service limits and ordering requirements.

## Common failure patterns
String scraping when objects exist, swallowing exceptions, returning success after partial failure, hard-coded secrets, non-idempotent mutations, unbounded fan-out, hidden module dependencies, and scripts that cannot be safely dry-run.

## Verification
Run automated tests where feasible, execute against a controlled cohort, verify repeated execution produces no unintended changes, and compare resulting system state with the declared outcome.

## Expected output
Versioned automation that is repeatable, diagnosable, privilege-conscious, and safe to operate.

## Stop conditions
Stop when required privileges are excessive or unclear, target discovery is unreliable, the operation is destructive without recovery, or automation cannot distinguish partial failure from success.