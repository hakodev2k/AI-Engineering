# Security Testing Rules

## Purpose
Require repeatable evidence that mobile security controls work under realistic failure and abuse conditions.

## Scope
Static analysis, dynamic testing, instrumentation, integration tests, manual assessment, and regression tests.

## MUST
- Map security-critical requirements to verification methods and preserve regression coverage for confirmed vulnerabilities.
- Test production-equivalent builds because debug and release security behavior can differ.
- Include negative tests for authentication, authorization, storage, transport, IPC, deep links, and hostile input where applicable.
- Triage findings by exploitability, impact, reachability, and control effectiveness.

## MUST NOT
- Declare an application secure solely because an automated scanner reports no findings.
- Suppress security findings without documented rationale and ownership.
- Test only happy paths for security-critical workflows.

## SHOULD
- Combine automated checks with targeted manual review for high-risk features.
- Use representative platform versions and device configurations.

## Exceptions
Unexecuted critical tests require documented blocker, residual risk, compensating evidence, owner, and release approval.

## Verification
Review requirement-to-test traceability, CI results, manual assessment evidence, regression tests, finding dispositions, and production-build coverage.