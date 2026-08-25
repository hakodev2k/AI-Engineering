# Source Control Exposure Rules

## Purpose
Prevent sensitive authentication material from being persisted in version control and ensure safe remediation when exposure occurs.

## Scope
Repositories, commits, branches, pull requests, patches, mirrors, and generated files.

## MUST
- Automated scanning MUST cover repositories that can contain application or infrastructure configuration.
- Confirmed sensitive material in source control MUST trigger the organization’s approved incident and credential-replacement process.
- Remediation MUST account for copies in mirrors, build outputs, and collaboration systems.
- Findings MUST be handled without reproducing sensitive values.

## MUST NOT
- Removing a file alone MUST NOT be treated as complete remediation.
- Repository history changes MUST NOT occur without repository-owner approval and impact review.
- Scanner findings MUST NOT be pasted into ordinary tickets when they contain sensitive values.

## SHOULD
- Combine developer-side prevention with server-side scanning.
- Tune detection using narrowly scoped exclusions with periodic review.

## Exceptions
Any scanner exclusion requires documented rationale, owner, scope, validation evidence, and review date.

## Verification
Review scanner coverage, finding disposition, remediation records, repository history controls, build outputs, and evidence that exposed material is no longer accepted by its issuer.