# Local Development Environment

## Purpose
Create a fast, reproducible local workflow for developers integrating AI services, including credentials, mocks, fixtures, tracing, and safe test data.

## When to use
Use when onboarding developers, standardizing local setup, reducing environment drift, or enabling offline/low-cost development.

## Inputs
Repository, runtime requirements, SDKs, service dependencies, secrets policy, test data, container tooling, local inference options, and network constraints.

## Context to inspect
Inspect setup scripts, environment files, containers, package managers, credential flows, test fixtures, service emulators, and documentation. Reproduce setup from a clean machine or isolated environment.

## Core knowledge
Local environments should minimize hidden state and production coupling. Favor reproducibility, least privilege, explicit configuration, disposable dependencies, and clear separation between real and simulated AI calls.

## Procedure
1. Enumerate runtime and service prerequisites.
2. Remove unnecessary global dependencies.
3. Define environment bootstrap and dependency installation.
4. Establish safe credential acquisition and storage.
5. Provide deterministic fixtures or mocks for routine development.
6. Make real-model integration opt-in and clearly labeled.
7. Add local tracing/logging for prompts, tool calls, latency, and errors without exposing secrets.
8. Seed representative non-sensitive test data.
9. Add health checks for dependencies.
10. Document reset and cleanup procedures.
11. Validate on each supported operating system.
12. Measure setup time and recurring feedback-loop latency.

## Decision points
Use mocks for deterministic logic tests; use real services for integration semantics. Use containers when they reduce dependency drift, but avoid them when native tooling is simpler and equally reproducible.

## Common failure patterns
Requiring production credentials, undocumented global packages, stale `.env` assumptions, expensive model calls during unit tests, platform-specific scripts, and setup that only works on the author's machine.

## Verification
Bootstrap from a clean environment, run tests, exercise one mocked and one real integration path, rotate credentials, reset dependencies, and confirm secrets never appear in logs or source control.

## Expected output
A reproducible local setup with bootstrap instructions, safe configuration, test fixtures, diagnostics, and reset procedures.

## Stop conditions
Stop if secure credentials cannot be provisioned, required dependencies cannot be legally or technically emulated, or local tooling would expose production data.