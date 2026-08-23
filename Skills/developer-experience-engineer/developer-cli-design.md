# Developer CLI Design

## Purpose
Create command-line interfaces that make common engineering workflows discoverable, scriptable, safe, and consistent.

## When to use
Use when developers repeatedly compose fragile commands, scripts proliferate, or platform operations need a stable interface.

## Inputs
Target workflows, existing scripts/APIs, authentication model, supported environments, and automation requirements.

## Context to inspect
Inspect command conventions, error handling, exit codes, config precedence, interactive use, machine-readable output, and backward compatibility.

## Core knowledge
A good CLI is an API: commands and output become dependencies. Favor composability, deterministic behavior, explicit destructive actions, and useful diagnostics.

## Procedure
1. Identify high-value jobs rather than mirroring backend APIs.
2. Define nouns, verbs, arguments, options, and defaults consistently.
3. Specify config/environment precedence.
4. Provide human and structured output where needed.
5. Define stable exit codes and errors.
6. Add confirmation or dry-run for destructive actions.
7. Handle authentication securely.
8. Add shell completion and examples when useful.
9. Test interactive and automation scenarios.
10. Version breaking behavior deliberately.

## Decision points
Use prompts for humans but flags for automation. Prefer explicit commands over magical inference for risky operations.

## Common failure patterns
Unstable output, hidden side effects, secrets in arguments/logs, inconsistent flags, success exit codes on partial failure, and mandatory interactivity.

## Verification
Run representative happy, invalid, unauthorized, network-failure, and scripted scenarios and verify outputs and exit codes.

## Expected output
A documented, testable CLI contract with safe workflows and compatibility expectations.

## Stop conditions
Stop when underlying API semantics or authorization boundaries are unresolved.