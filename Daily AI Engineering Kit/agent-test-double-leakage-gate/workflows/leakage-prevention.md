# Workflow: Test-Double Leakage Prevention

## Trigger
Deployable code/configuration or test-double infrastructure changes.

## Stages
1. Context: inspect deployable modules, composition roots, configuration, nearby test doubles.
2. Scan: changed-file scan; expand for indirect/dynamic wiring.
3. Classify: clean, confirmed leakage, candidate exception, or unresolved.
4. Remediate: smallest safe production-capable wiring change.
5. Re-scan and run build/unit/integration/static checks.
6. Independent verification: inspect diff and runtime resolution.
7. Complete: record verified status, risk, approvals/exceptions.

## Approval points
Production credentials/secrets, infrastructure, schema, deploy config, public APIs, external production endpoints, and security controls require explicit human approval. High-severity exceptions require owner review.

## Retry rules
Invalid input/policy: 1 retry after correction. Transient scanner/tool failure: 2 retries if no mutation. Remediation/test failure: 2 cycles total. Verification failure returns to remediation only if a cycle remains.

## Evidence preserved
Reports, diffs, build/test output, runtime-resolution evidence, approvals.

## Failure paths
Permission failure, unknown source of truth, ambiguous dynamic resolution, exhausted remediation, or missing approval blocks completion.

## Definition of Done
All in-scope files scanned; no unexcepted blockers; production runtime resolution evidenced; test doubles test-scoped; relevant checks pass; independent verification succeeds; approvals recorded.