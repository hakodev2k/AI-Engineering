# Configuration Change Approval

## Change identity
- Application/service: <name>
- Environment: <environment>
- Baseline revision/path: <reference>
- Current snapshot revision/path: <reference>
- Drift result path: <path>

## Requested change
- Keys affected: <exact key list>
- Old values: <redacted/non-secret values only>
- New values: <redacted/non-secret values only>
- Reason: <business/technical reason>
- Evidence: <repository/deployment/change-record references>

## Risk review
- Authentication/authorization impact: <none|details>
- Data-plane/database/storage impact: <none|details>
- Network/TLS/security-control impact: <none|details>
- Tenant/customer scope: <scope>
- Expected user impact: <impact>

## Execution boundary
- Authorized operator/mechanism: <identity or controlled system>
- Planned execution method: <method>
- This package will not apply the production change.

## Rollback
- Previous known-good values/revision: <reference>
- Rollback trigger: <measurable condition>
- Rollback method: <method>

## Verification
- Fresh snapshot source: <source>
- Expected post-change gate status: <passed or explicitly documented accepted drift>
- Additional health checks: <checks>

## Human approval
- Approver: <name/identity>
- Decision: <approved|rejected>
- Approval timestamp: <ISO-8601>
- Approval reference: <ticket/change/PR reference>

Approval is invalid if the environment, baseline, current snapshot, affected keys, or intended values materially change after review.
