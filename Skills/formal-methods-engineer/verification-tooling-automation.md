# Verification Tooling Automation

## Purpose
Integrate formal verification into repeatable engineering workflows so models, proofs, and solver checks remain current as systems evolve.

## When to use
Use when verification artifacts are part of ongoing development rather than one-time analysis, especially for CI gates, nightly exhaustive checks, and release assurance.

## Inputs
Formal models, proof projects, solver commands, tool versions, resource limits, CI platform, artifact-retention policy, and release criteria.

## Preconditions
Verification commands must be reproducible locally from a clean environment.

## Context to inspect
Dependency pinning, solver/prover versions, caches, nondeterministic seeds, timeouts, generated files, CI concurrency, secret requirements, and existing build stages.

## Core knowledge
Verification automation must distinguish logical failure, tool error, timeout, resource exhaustion, and infrastructure failure. Fast checks and exhaustive checks often need separate cadences. Reproducibility requires pinned toolchains and retained diagnostic artifacts.

## Procedure
1. Define fast, full, and release verification profiles.
2. Pin formal-tool and solver versions.
3. Make commands deterministic where tools permit it.
4. Separate syntax/type checks from semantic verification.
5. Fail CI on violated critical properties or unapproved proof admissions.
6. Treat timeouts and incomplete exploration as inconclusive, not success.
7. Retain counterexamples, logs, proof summaries, and checked bounds.
8. Cache only artifacts whose reuse is sound for the tool.
9. Add change detection to run affected proof suites without hiding global obligations.
10. Schedule deeper verification at an appropriate cadence.
11. Monitor runtime growth and flaky/inconclusive verification jobs.
12. Document local reproduction commands for every failure class.

## Decision points
Keep high-signal lightweight checks on every change; move expensive exhaustive analyses to gated or periodic workflows while preserving required release evidence.

## Common failure patterns
Floating solver versions, swallowing timeouts, non-reproducible seeds, stale generated models, over-aggressive caching, and CI jobs that report green after partial exploration.

## Verification
Reproduce CI from a clean environment, intentionally introduce a property violation, force a timeout to confirm correct classification, and verify stored artifacts are sufficient for diagnosis.

## Expected output
A reproducible verification pipeline with explicit profiles, failure semantics, retained evidence, and release gates.

## Stop conditions
Stop relying on automated verification when tool versions drift, failures cannot be reproduced, or CI configuration can silently skip required evidence.