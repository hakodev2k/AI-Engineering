# Pull Request Review Workflow

## Trigger
Pull request opened or updated.

## Stages
1. Collect diff and repository context.
2. Run deterministic validation.
3. Execute quality reviewer.
4. Execute security reviewer.
5. Aggregate findings.
6. Verify evidence.

## Retry
- Maximum retries: 2.
- Retry only transient tool failures.
- Preserve collected evidence.
- Stop on permission failures or missing context.

## Definition of Done
- Review findings contain evidence.
- Security and quality checks completed.
- Blocking risks are explicitly reported.
