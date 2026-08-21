# Dependency Upgrade Workflow

Trigger: upgrade request or security advisory.

Stages:
1. Detect dependency.
2. Collect context.
3. Research changes.
4. Plan migration.
5. Apply upgrade.
6. Run tests.
7. Review diff.
8. Verify.

Retry:
- maximum 2 retries
- only transient tool failures
- preserve logs
- escalate after limit

Approval required:
- major version changes
- breaking API changes
- production deployment

Done when tests pass and risks are documented.
