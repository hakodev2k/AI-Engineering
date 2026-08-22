# Docs as Code

## Purpose
Manage technical documentation with version control, review, automation, and reproducible builds.
## When to use
Use when docs evolve with software and benefit from engineering workflows.
## Inputs
Repository conventions, doc platform, build tooling, contribution model, release process.
## Context to inspect
Branches, CI, linters, preview builds, ownership, templates, generated content.
## Core knowledge
Docs-as-code improves traceability but should not impose unnecessary engineering friction on contributors. Treat source, build, deployment, and review as one system.
## Procedure
1. Inspect repository and publishing workflow.
2. Define source formats and canonical location.
3. Establish local build/preview instructions.
4. Add linting, link, and structural checks.
5. Define review ownership and change rules.
6. Integrate previews into pull requests.
7. Version docs with product releases where needed.
8. Automate publishing only after validation succeeds.
## Decision points
Use code workflows for versioned technical docs; prefer lower-friction CMS workflows when contributors cannot reasonably use Git.
## Common failure patterns
Docs that cannot build locally, unreviewed generated output, broken preview parity, and publishing from stale branches.
## Verification
Fresh contributors can edit, preview, validate, review, and publish through documented steps.
## Expected output
Reliable documentation development and delivery workflow.
## Stop conditions
Stop when publishing credentials, branch protection, or production deployment requires unauthorized changes.