# PR Verification Workflow

## Trigger
New AI-assisted pull request.

## Stages
1. Collect diff and repository context.
2. Create verification plan.
3. Review implementation.
4. Run deterministic checks.
5. Review risks.
6. Generate verification result.

## Retry Policy
Maximum 2 retries for transient tooling failures.
Build failures require investigation, not repeated execution.

## Approval Points
Human approval required for merge, production changes, migrations, and security-impacting changes.

## Done
Verification evidence exists and no blocking issue remains.
