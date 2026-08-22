# User Acceptance Testing

## Purpose
Plan and coordinate business acceptance testing that proves the delivered solution supports real business scenarios, rules, and operational outcomes.

## When to use
Use before release of material business changes, migrations, workflow changes, integrations, and regulated or high-risk functionality.

## Inputs
Validated requirements, acceptance criteria, process models, business rules, test environment, representative data, release scope, and known defects.

## Preconditions
The solution is stable enough for business validation and critical test data and users are available.

## Context to inspect
Business-critical journeys, user roles, exception paths, integrations, migrated data, outstanding defects, environment limitations, and go-live criteria.

## Core knowledge
UAT validates business fitness rather than duplicating system testing. Senior BAs ensure scenarios represent real work and that acceptance decisions consider known limitations explicitly.

## Procedure
1. Define UAT scope and business acceptance objectives.
2. Identify critical end-to-end scenarios and user roles.
3. Trace scenarios to requirements and business rules.
4. Prepare representative test data and prerequisites.
5. Define expected outcomes and evidence to capture.
6. Assign business testers and responsibilities.
7. Brief testers on scope without coaching them toward false success.
8. Triage findings into defects, requirement gaps, data issues, and training issues.
9. Assess unresolved findings against go-live criteria.
10. Obtain explicit acceptance, conditional acceptance, or rejection from authorized owners.

## Decision points
Prioritize high-impact and high-frequency workflows when time is constrained; include rare scenarios when failure impact is severe.

## Common failure patterns
Using UAT as generic regression testing, testing only happy paths, accepting based on defect count alone, and allowing unauthorized users to sign off.

## Verification
Confirm critical scenarios were executed with evidence, findings are dispositioned, and acceptance is recorded by an authorized business owner.

## Expected output
A UAT plan, scenario set, findings log, traceability evidence, and formal business acceptance decision.

## Stop conditions
Stop when the environment is materially unrepresentative, critical data is unavailable, or blocker defects prevent meaningful business validation.