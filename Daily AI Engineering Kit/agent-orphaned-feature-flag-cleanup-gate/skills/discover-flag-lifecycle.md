# Skill: Discover Flag Lifecycle

## Purpose
Prove whether a feature flag is truly orphaned and identify the exact behavior that must remain.

## When to use
Before removing a feature flag, flag branch, flag configuration binding, or related telemetry.

## Inputs
Flag key, repository root, flag registry, policy, issue/rollout evidence when available.

## Preconditions
The flag key is exact and the registry is readable.

## Required context
Start with the registry entry, all literal repository references, nearby tests, configuration binding, and the runtime decision point. Expand only when those references lead to additional behavior.

## Allowed tools
Repository read/search, Git diff/status, test runner, `scripts/flag_cleanup_gate.py scan`.

## Constraints
Read-only during discovery. Do not query or mutate production flag providers unless separately authorized.

## Process
1. Read the registry entry and record owner, state, retired date, and expected retired behavior.
2. Scan for the exact flag key and classify each reference as runtime decision, config binding, test, telemetry, documentation, generated artifact, or historical migration.
3. Trace the runtime decision point to both enabled and disabled branches.
4. Identify side effects, validation, authorization, logging, metrics, and rollback behavior in each branch.
5. Read nearby tests and determine which branch is currently asserted as permanent behavior.
6. Compare repository evidence with registry `expected_behavior`; conflict is blocking evidence, not a reason to guess.
7. Identify cleanup candidates and non-removable historical references.
8. Produce a removal plan with evidence paths and acceptance checks.

## Expected output
A lifecycle finding containing flag state, permanent branch, references, cleanup candidates, risks, confidence, and blocking conflicts.

## Verification
The plan is complete only when every non-allowlisted reference has a disposition and the permanent behavior is supported by registry plus repository/test evidence.

## Failure handling
Missing registry entry, conflicting permanent behavior, unreadable source, or unknown runtime ownership blocks implementation. Tool failures may be retried twice only when transient.

## Stop conditions
Stop before production mutation, security-control weakening, breaking API change, data deletion, or any action requiring approval.
