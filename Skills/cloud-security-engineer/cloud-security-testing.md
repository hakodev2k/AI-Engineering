# Cloud Security Testing

## Purpose
Validate cloud security controls through safe, evidence-driven tests of authorization, exposure, configuration, and detection behavior.

## When to use
Use before production, after major control changes, during assurance reviews, or to validate remediation.

## Inputs
Threat model, architecture, test environment, identities, expected policies, logging, and authorization scope.

## Context to inspect
Inspect test boundaries, production protections, rate limits, destructive operations, provider terms, and monitoring coverage.

## Core knowledge
Security testing should prove both allowed and denied behavior. Cloud control-plane tests can have broad blast radius; use least-destructive techniques and explicit authorization.

## Procedure
1. Define hypotheses and success criteria.
2. Confirm written scope and safe environment.
3. Create representative low-privilege identities.
4. Test public exposure and network boundaries.
5. Test IAM allowed/denied actions.
6. Test storage and secret access controls.
7. Test guardrails against invalid changes.
8. Generate benign detection events.
9. Record exact evidence and cleanup actions.
10. Re-test after fixes.

## Decision points
Use non-production for destructive or high-risk tests; production validation should favor read-only or carefully bounded techniques.

## Common failure patterns
Testing only happy paths, using admin credentials, unapproved destructive tests, leaving test resources exposed, and failing to validate detections.

## Verification
Each control has observed evidence matching expected behavior, and test artifacts are cleaned up without weakening controls.

## Expected output
Security test record with hypotheses, evidence, findings, remediation, and re-test status.

## Stop conditions
Stop immediately if scope is exceeded, unexpected production impact appears, or a test indicates active compromise.