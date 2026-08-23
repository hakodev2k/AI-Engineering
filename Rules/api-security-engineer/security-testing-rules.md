# API Security Testing Rules

## Purpose
Require repeatable evidence that API security controls resist expected attacks.

## Scope
Automated and manual security testing across API lifecycle stages.

## MUST
- Test authentication, authorization, validation, data exposure, abuse limits, and security-critical failure paths.
- Include negative tests for unauthorized identities, cross-object access, malformed input, replay, and boundary conditions.
- Reproduce and regression-test confirmed vulnerabilities where safe and practical.
- Keep tests isolated from production destructive effects.

## MUST NOT
- Claim an API is secure solely because functional tests pass or a scanner reports no findings.
- Run intrusive testing against production without explicit authorization and safeguards.

## SHOULD
- Combine contract-driven tests, fuzzing, dynamic testing, static analysis, and targeted manual review according to risk.

## Exceptions
Unavailable test techniques require documented gap, alternative evidence, risk, and follow-up.

## Verification
Inspect test suites, CI results, scanner output, penetration-test evidence, and regression coverage for past findings.