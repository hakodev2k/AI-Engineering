# SQL Request

## Goal
<question or mutation outcome>

## Target
- Environment: <development|staging|production>
- Database engine: <engine/version>
- Database/schema: <non-secret identifiers>

## Evidence
- Relevant repository files: <paths>
- Relevant schema objects: <objects>
- Facts: <confirmed facts>
- Hypotheses: <unconfirmed hypotheses>

## Intended SQL
- Intent: <read|write>
- Expected affected/read rows: <bounded estimate>
- Tenant/account boundary: <predicate or not applicable>
- SQL artifact path: <path>

## Verification
- Expected result: <measurable postcondition>
- Read-only verification query path: <path>

## Write-only approval packet
- Why mutation is necessary: <reason>
- Rollback/compensation: <procedure>
- Lock/concurrency risk: <risk>
- Approval reference: <leave empty until human approval>

Do not include credentials, tokens, connection strings, or sensitive row data.
