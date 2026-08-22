# Engineering Rules

Mandatory, technology- or role-specific constraints for AI-assisted engineering work. Rules define what an agent must, should, and must not do; they are not executable software and require no installation.

Every individual rule file is self-contained and can be copied without its discipline folder. When copying a whole discipline, keep its `README.md` as the local index; links in that index point only to files inside the copied folder.

## How to use

1. Select the discipline that owns the change.
2. Load only the rule files relevant to the task and its risk.
3. Resolve conflicts in favor of repository policy, security boundaries, explicit user instructions, and the stricter safety requirement.
4. Optionally pair rules with relevant Skills procedures or a Daily AI Role when that additional context is useful.
5. Turn important rules into deterministic tests, hooks, or CI gates in the target repository.

Rules do not grant permission. Production changes, destructive operations, secret access, permission expansion, external communications, and irreversible actions still require the approvals defined by the target environment.

## Disciplines

- [`accessibility-engineer/`](accessibility-engineer/)
- [`agent-engineer/`](agent-engineer/)
- [`ai-engineer/`](ai-engineer/)
- [`aws-engineer/`](aws-engineer/)
- [`azure-engineer/`](azure-engineer/)
- [`business-analyst/`](business-analyst/)
- [`cloud-engineer/`](cloud-engineer/)
- [`data-engineer/`](data-engineer/)
- [`data-scientist/`](data-scientist/)
- [`database-engineer/`](database-engineer/)
- [`devops-engineer/`](devops-engineer/)
- [`dotnet-backend-developer/`](dotnet-backend-developer/)
- [`engineering-manager/`](engineering-manager/)
- [`machine-learning-engineer/`](machine-learning-engineer/)
- [`observability-engineer/`](observability-engineer/)
- [`performance-engineer/`](performance-engineer/)
- [`platform-engineer/`](platform-engineer/)
- [`product-manager/`](product-manager/)
- [`product-owner/`](product-owner/)
- [`project-manager/`](project-manager/)
- [`qa-automation-engineer/`](qa-automation-engineer/)
- [`react-developer/`](react-developer/)
- [`release-engineer/`](release-engineer/)
- [`security-engineer/`](security-engineer/)
- [`site-reliability-engineer/`](site-reliability-engineer/)
- [`software-architect/`](software-architect/)
- [`solution-architect/`](solution-architect/)
- [`technical-lead/`](technical-lead/)
- [`technical-writer/`](technical-writer/)

Each discipline contains its own standalone index with direct links to every file in that copied folder.
