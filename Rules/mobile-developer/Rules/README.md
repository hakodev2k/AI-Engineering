# Engineering Rules

Mandatory, technology- or role-specific constraints for AI-assisted engineering work. Rules define what an agent must, should, and must not do; they are not executable software and require no installation.

Every individual rule file is self-contained and can be copied without its discipline folder. When copying a whole discipline, keep its `README.md` as the local index; links in that index point only to files inside the copied folder.

## How to use

1. Select the discipline that owns the change.
2. Load only the rule files relevant to the task and its risk.
3. Resolve conflicts in favor of repository policy, security boundaries, explicit user instructions, and the stricter safety requirement.
4. When available, optionally pair rules with relevant [Skills](../Skills/) procedures or a [Daily AI Role](../Daily%20AI%20Role/).
5. Turn important rules into deterministic tests, hooks, or CI gates in the target repository.

Rules do not grant permission. Production changes, destructive operations, secret access, permission expansion, external communications, and irreversible actions still require the approvals defined by the target environment.

## Disciplines

- [`agent-engineer/`](agent-engineer/)
- [`ai-engineer/`](ai-engineer/)
- [`data-engineer/`](data-engineer/)
- [`devops-engineer/`](devops-engineer/)
- [`dotnet-backend-developer/`](dotnet-backend-developer/)
- [`machine-learning-engineer/`](machine-learning-engineer/)
- [`platform-engineer/`](platform-engineer/)
- [`qa-automation-engineer/`](qa-automation-engineer/)
- [`react-developer/`](react-developer/)
- [`security-engineer/`](security-engineer/)
- [`site-reliability-engineer/`](site-reliability-engineer/)
- [`software-architect/`](software-architect/)
- [`solution-architect/`](solution-architect/)

Each discipline contains its own index with direct links to every rule file.
