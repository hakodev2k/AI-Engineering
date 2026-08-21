# PR Review Workflow

Trigger: pull request opened or updated.

Stages:
1. Collect diff and context.
2. Run deterministic checks.
3. Delegate security and architecture review.
4. Aggregate findings.
5. Verify evidence.
6. Produce report.

Retry policy: maximum 2 retries for transient tool failures.
Stop on permission failures or missing context.