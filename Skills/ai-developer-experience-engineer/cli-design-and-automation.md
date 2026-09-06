# CLI Design and Automation

## Purpose
Design command-line tooling that gives developers fast, scriptable, diagnosable access to AI platform workflows across local development and CI/CD.

## When to use
Use for authentication, project initialization, model operations, evaluations, deployments, configuration, diagnostics, or administrative workflows exposed through a CLI.

## Inputs
User workflows, API capabilities, shell environments, authentication requirements, configuration sources, CI needs, exit-code conventions, and security constraints.

## Context to inspect
Inspect current commands, flags, config files, environment variables, stdout/stderr behavior, shell completion, machine-readable output, telemetry, and automation scripts that consume the CLI.

## Core knowledge
A CLI has both human and machine consumers. Stable exit codes, deterministic noninteractive modes, structured output, explicit destructive-action confirmation, and useful diagnostics are as important as command discoverability.

## Procedure
1. Identify high-frequency interactive and automated workflows.
2. Design command hierarchy around user tasks rather than internal services.
3. Define flags, defaults, config precedence, and environment-variable behavior.
4. Separate human-readable output from stable structured formats such as JSON.
5. Define exit codes and stderr usage.
6. Support noninteractive authentication and CI-safe execution where permitted.
7. Add confirmations for destructive actions and bypass flags only where safe.
8. Provide dry-run or preview behavior when practical.
9. Implement shell completion and contextual help for complex commands.
10. Add diagnostic verbosity without leaking secrets.
11. Test across supported shells and operating systems.
12. Validate scripts against version upgrades.

## Decision points
Prefer flags for explicit automation and prompts for optional interactive guidance. Use config files for durable project settings and environment variables for deployment-specific secrets or overrides. Keep machine-readable output version-stable.

## Common failure patterns
Breaking scripts through cosmetic output changes, prompting during CI, inconsistent exit codes, logging secrets, ambiguous config precedence, hidden network calls, and destructive defaults.

## Verification
Run commands in clean shells, CI containers, failure scenarios, invalid-auth cases, partial network failures, and JSON-parsing automation. Confirm exit codes and backward compatibility.

## Expected output
A stable CLI surface with documented commands, structured output, automation semantics, diagnostics, and tests.

## Stop conditions
Stop when credential handling is unresolved, automation would require unsafe secret exposure, destructive operations lack approval boundaries, or compatibility behavior is undefined.