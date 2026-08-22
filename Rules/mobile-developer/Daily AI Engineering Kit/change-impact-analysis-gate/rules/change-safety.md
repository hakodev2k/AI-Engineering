# Change Safety Rules

## MUST
- Complete an impact manifest before editing non-trivial production source code.
- Cite repository evidence for every `direct` or `indirect` affected component.
- Record uncertain areas explicitly.
- Identify tests or verification actions before implementation.
- Re-run changed-file detection after implementation.
- Account for every changed file before declaring the task verified.
- Require explicit human approval before database schema changes, destructive data operations, breaking public/durable contracts, production configuration/infrastructure changes, permission/secret changes, force pushes, or broad dependency upgrades.
- Stop when a required approval is missing.

## MUST NOT
- Modify source code during the repository-mapping stage.
- Claim “no impact” only because search returned no matches.
- Expand a public API/event/database contract without assessing compatibility.
- Hide unexpected changed files by adding them to the manifest without evidence.
- Disable tests, static analysis, security controls, or validation to make verification pass.
- Run destructive database, deployment, infrastructure, secret-management, or Git history-rewrite commands autonomously.
- Retry the same deterministic failure indefinitely.

## SHOULD
- Prefer the smallest change that satisfies the requested behavior.
- Prefer existing repository conventions over introducing new abstractions.
- Separate confirmed evidence from hypotheses.
- Use deterministic scripts for file-set and schema validation.
- Run focused tests first, followed by broader regression checks when risk warrants it.
- Preserve backward compatibility unless breaking behavior is explicitly approved.

## Default protected path patterns
Treat changes under these patterns as high-signal and require explicit impact notes when present:

```text
**/migrations/**
**/database/**
**/infra/**
**/terraform/**
**/deploy/**
**/.github/workflows/**
**/openapi/**
**/schemas/**
**/*appsettings*.json
**/*.proto
```

Projects should extend this list with repository-specific production and security paths.
