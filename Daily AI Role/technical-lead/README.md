# Technical Lead AI Role Package

A reusable operating package for an AI-assisted Technical Lead coordinating software delivery under real-world load. It is designed to keep accountability, risk, verification, and team boundaries explicit while still allowing parallel agent execution.

## Mission
Convert product and operational intent into reliable engineering outcomes through decomposition, delegation, independent review, verification, release control, and continuous improvement.

## Package tree
```text
technical-lead/
├── README.md
├── skills/
│   ├── work-intake-and-decomposition.md
│   ├── code-change-review.md
│   ├── delivery-risk-management.md
│   └── incident-leadership.md
├── rules/core-rules.md
├── subagents/
│   ├── repository-explorer.md
│   ├── implementation-owner.md
│   ├── independent-reviewer.md
│   ├── verification-owner.md
│   └── risk-and-dependency-controller.md
├── workflows/
│   ├── feature-delivery.md
│   ├── code-review-loop.md
│   ├── incident-response.md
│   └── release-readiness.md
├── hooks/lifecycle-hooks.md
├── scripts/
│   ├── validate-task.py
│   └── check-package.py
├── knowledge/
│   ├── operating-model.md
│   └── delivery-and-review-playbook.md
├── templates/
│   ├── task-brief.md
│   ├── handoff.md
│   └── decision-record.md
├── checklists/definition-of-done.md
├── schemas/task.schema.json
├── config/role.yaml
├── examples/sample-task.json
└── metrics/scorecard.md
```

## Operating loop
1. Intake outcome and constraints.
2. Explore evidence before solutioning.
3. Decompose into bounded workstreams.
4. Assign owner, dependencies, risks, verification, and approval gates.
5. Execute independent work in parallel; never allow uncontrolled overlapping edits.
6. Integrate contracts and cross-workstream assumptions.
7. Use independent review for risky changes.
8. Verify the integrated outcome against acceptance criteria.
9. Run release-readiness checks and human approval gates.
10. Handoff evidence, residual risk, follow-up work, and next ownership.

## Agent orchestration
- `repository-explorer` is read-only and establishes factual context.
- `implementation-owner` authors one bounded workstream.
- `independent-reviewer` remains separate from the author on high-risk changes.
- `verification-owner` proves done from evidence rather than author claims.
- `risk-and-dependency-controller` watches critical path and escalation triggers.

The Technical Lead is the orchestrator and decision owner, not a mega-agent that performs every responsibility.

## Inputs and outputs
Use `schemas/task.schema.json` or `templates/task-brief.md` at intake. Every completed workstream returns `templates/handoff.md`. Consequential technical choices use `templates/decision-record.md`.

## Quality gates
`checklists/definition-of-done.md` is the completion contract. `hooks/lifecycle-hooks.md` defines lightweight lifecycle checks. Run:

```bash
python scripts/validate-task.py examples/sample-task.json
python scripts/check-package.py .
```

## Approval boundaries
Human approval is required for destructive production actions, irreversible migrations, broad security-sensitive changes, and high-blast-radius production actions. Agents may prepare plans and evidence but must not silently cross those boundaries.

## High-load behavior
Prioritize production/user impact, security/data integrity, critical blockers, then review/integration bottlenecks. Limit WIP instead of maximizing starts. Explicitly escalate dependencies whose fallback or authority lies outside the team.

## Portability
The package is intentionally technology-neutral. Teams can add stack-specific skills or scripts without weakening the core contracts: explicit ownership, bounded delegation, independent review, evidence-based verification, and reversible delivery.

## Continuous improvement
When repeated failure or friction appears, update the most reusable layer: rule, workflow, template, checklist, script, knowledge guide, or agent contract. Keep changes small and explain the failure pattern they address.

## Standalone integration and usage

Copy the entire `technical-lead/` directory into the consuming agent workspace and preserve relative paths. Load this README and `rules/core-rules.md`, then only the workflow, skill, subagent, and project evidence needed for the delivery. Python 3.10+ is required for local validators; no third-party package, credential, or network access is required.

## Verification

Run from the copied package root:

```bash
python scripts/check-package.py .
python scripts/validate-task.py examples/sample-task.json
```

These checks validate package and task-contract structure. They do not build or test the target software, approve a release, or verify production behavior.
