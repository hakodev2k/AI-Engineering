# Mobile Security Testing

## Purpose
Plan and execute risk-driven security testing across mobile binaries, runtime behavior, local data, network flows, and backend interactions.

## When to use
Use before major releases, after sensitive changes, during assessments, or when validating remediations.

## Inputs
Threat model, build, test accounts, API contracts, architecture, supported OS versions, security requirements.

## Preconditions
Use authorized environments and accounts; define test scope and safety constraints.

## Context to inspect
Package configuration, storage, IPC, links, WebViews, authentication, network traffic, permissions, APIs, and dependencies.

## Core knowledge
Combine static, dynamic, and abuse-case testing. Automated scanners provide coverage but cannot validate business logic or trust-boundary assumptions alone.

## Procedure
1. Derive test objectives from threat model and changed code.
2. Inspect packaged manifest/entitlements and binaries.
3. Exercise local storage and logs.
4. Test network trust and API manipulation.
5. Test authentication/session lifecycle.
6. Test deep links, IPC, WebViews, and exported components.
7. Evaluate high-risk device states where relevant.
8. Record reproducible evidence and impact.
9. Retest fixes and regression cases.

## Decision points
Prioritize manual testing for business logic and privileged flows; automate stable checks for regression coverage.

## Common failure patterns
Scanner-only assurance, testing debug instead of release builds, ignoring backend behavior, weak evidence, and marking mitigations verified without retest.

## Verification
Each material finding has reproduction steps, expected/actual behavior, severity rationale, remediation evidence, and retest result.

## Expected output
A risk-ranked test record with reproducible findings and verified remediation status.

## Stop conditions
Stop destructive tests if production impact is possible; escalate scope or authorization ambiguity.