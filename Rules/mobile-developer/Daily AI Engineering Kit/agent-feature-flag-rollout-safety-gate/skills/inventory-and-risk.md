# Skill: Inventory and Risk

## Purpose
Build an evidence-backed map of a requested feature-flag change before implementation.

## When to use
At the start of every flag creation, targeting change, rollout increase, rollback change, or cleanup.

## Inputs
Change request JSON, repository root, policy, relevant issue/acceptance criteria.

## Preconditions
Repository is readable; request names a flag and environment; current branch is known.

## Allowed tools
Repository search/read, Git diff/status, test discovery, deterministic scripts. Read-only provider/telemetry access may be used when explicitly available.

## Constraints
Do not mutate production providers, secrets, infrastructure, or approval records.

## Procedure
1. Validate the request against `schemas/change-request.schema.json` conceptually and run `scripts/feature_flag_gate.py`.
2. Search exact flag key and known aliases across source, tests, configuration, deployment files, and docs.
3. Identify evaluation entry points and both enabled/disabled behavior.
4. Record current defaults, environment overrides, targeting/cohort rules, percentage, and fallback.
5. Locate tests for both paths and identify missing coverage.
6. Determine blast radius: users, tenants, APIs, jobs, data writes, security boundaries, and irreversible side effects.
7. Classify whether approval is required using `config/policy.yaml` and `rules/feature-flag-safety.md`.
8. Define rollback trigger and measurable verification signals.
9. Hand off an evidence-based plan; mark unknowns explicitly.

## Expected output
Flag inventory, affected paths, risk classification, approval requirement, test plan, rollback plan, open questions.

## Verification
Every claimed call site has a path reference; requested exposure matches the request; approval classification matches policy.

## Failure handling
Missing current state or rollback mechanism blocks implementation. Tool failures retry at most twice; unresolved access failures stop with evidence.

## Stop conditions
Stop before implementation if the flag is ambiguous, protected approval is missing, rollback is impossible, or scope cannot be bounded.