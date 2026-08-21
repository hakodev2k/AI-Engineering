# Daily AI Role

Reusable operating packages for AI agents acting in engineering, architecture, product, operations, design, research, and go-to-market roles.

## What a role package provides

A role defines a mission, responsibilities, non-responsibilities, expected inputs and outputs, operating workflow, approval boundaries, and completion criteria. Larger roles may also provide rules, skills, checklists, schemas, templates, hooks, knowledge, scripts, and specialist subagents.

Role packages are behavioral guidance. They are not standalone applications and do not require installation unless their README identifies an executable validation script.

## Select and compose roles

1. Choose one primary role that owns the outcome.
2. Add specialist roles only when responsibility or independent review must be separated.
3. Read the role's non-responsibilities and approval boundaries before execution.
4. Combine the role with the matching [Rules](../Rules/) and [Skills](../Skills/) discipline when available.
5. Add an engineering gate only when the task's risk warrants it.

Avoid assigning multiple roles overlapping authority over the same decision. A subagent may review or advise, but the workflow should retain one accountable owner and an explicit handoff target.

## Package anatomy

| Path | Purpose |
| --- | --- |
| `README.md` | Complete role contract and primary entrypoint. |
| `rules/` | Role-specific mandatory behavior. |
| `skills/` | Procedures the role can perform. |
| `workflows/` | Common task lifecycles. |
| `checklists/` | Deterministic preparation or completion checks. |
| `schemas/` and `templates/` | Structured intake, evidence, and handoff formats. |
| `subagents/` | Narrow specialist or independent-review responsibilities. |
| `scripts/` and `hooks/` | Optional validation and lifecycle automation. |

## Using a role

Provide the agent with the selected role README plus only the supporting files relevant to the task. Supply the objective, acceptance criteria, repository context, constraints, risk, deadline, and allowed tools. Require the agent to distinguish facts, assumptions, decisions, and approval-required actions.

For role packages containing Python validators, use Python 3.10+ and run commands from that role's root. The current role scripts use the Python standard library unless the package README says otherwise.

## Completion standard

A role should not claim completion solely because it produced an artifact. Completion requires the requested outcome, proportionate verification, explicit residual risks, and all required human approvals. Production deployment, destructive actions, permission expansion, secret changes, legal or financial commitments, and irreversible migrations remain human-controlled unless a governing policy explicitly says otherwise.

See [CONTRIBUTING.md](../CONTRIBUTING.md) for the required shape of new or updated roles.
