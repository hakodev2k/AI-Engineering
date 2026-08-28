# Sample Code Rules

## Purpose
Ensure public sample code teaches safe, maintainable patterns that developers can adapt confidently.

## Scope
Applies to repositories, snippets, quickstarts, notebooks, SDK examples, and conference demos.

## MUST
- Samples MUST run against the documented prerequisites and supported versions.
- Error handling, configuration, dependency setup, and cleanup MUST be sufficient for the intended learning context.
- Security-sensitive configuration MUST use placeholders or approved secret-loading patterns.
- Non-obvious shortcuts taken for teaching purposes MUST be labeled.

## MUST NOT
- MUST NOT embed live credentials, private endpoints, or production identifiers.
- MUST NOT encourage deprecated APIs when supported alternatives exist.
- MUST NOT omit validation when omission would teach an unsafe default.

## SHOULD
- Samples SHOULD be minimal without concealing operationally important behavior.
- Reusable examples SHOULD include automated validation in CI when practical.

## Exceptions
A deliberately simplified example requires an explicit note describing what a production implementation must add.

## Verification
Run the sample from a clean environment, inspect dependency versions and configuration, scan for secrets, and review documented assumptions.