# Skill: Review CLI Regression

## Purpose

Investigate comparator findings and either restore compatibility or prepare an explicit breaking-change approval package.

## Inputs

Baseline contract, candidate contract, comparator report, changed files, CLI tests.

## Process

1. Classify each finding as intended, accidental, or extractor error.
2. For extractor errors, fix the extractor and regenerate the candidate; do not edit the contract by hand to hide behavior.
3. For accidental breaks, locate the smallest implementation change that restores the baseline behavior.
4. Prefer aliases, optional defaults, and additive choices over removals.
5. Run CLI parser/help tests after each fix.
6. Re-run the comparator.
7. Allow at most two fix/retest cycles before escalating unresolved findings.
8. For intentional breaking changes, document affected commands/options, consumers, replacement behavior, migration window, release notes, and rollback strategy.
9. Obtain explicit human approval before treating an intentional break as accepted.
10. Hand all evidence to independent verification.

## Expected output

Either a compatible candidate report or an approved breaking-change evidence bundle.

## Verification

The final candidate behavior matches the generated candidate contract and all required tests pass.

## Failure handling

Extractor failures are deterministic validation failures; fix and retry once. Repeated implementation/test failures stop after two fix cycles.

## Stop conditions

Stop on missing baseline evidence, unresolved breaking findings, failed tests, missing required approval, or mismatch between runtime behavior and contract.