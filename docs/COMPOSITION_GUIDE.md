# Composition Guide

This is a pick-and-copy library. Select the smallest set of assets that gives an agent enough ownership, constraints, procedure, verification, and access for one defined outcome. Do not treat the six collections as a framework that must be installed together.

## Select in this order

1. **Ownership:** choose one [role package](../Daily%20AI%20Role/CATALOG.md) only when the task needs an operating mission, handoffs, or a repeatable multi-step workflow. A simple task can start with a rule or skill alone.
2. **Constraints:** add the smallest relevant file from [Rules](../Rules/) for requirements that must be true regardless of how the task is carried out.
3. **Procedure:** add a focused file from [Skills](../Skills/) for a repeatable task method, inputs, verification, and stop conditions.
4. **Control:** add one package from the [engineering kit](../Daily%20AI%20Engineering%20Kit/CATALOG.md) or the [security/performance kit](../Daily%20AI%20Engineering%20Security%20-%20Performance%20-%20Thinking/CATALOG.md) only when the task has a specific safety, evidence, runtime-integrity, or performance risk.
5. **External capability:** add one [MCP connector](../MCP-API/) only when the agent must interact with a named external provider. Provider access never replaces a rule, approval, or target-repository policy.

The task owner remains accountable. A role gives ownership; rules constrain behavior; skills describe a method; kits add a gate or evidence workflow; and MCP exposes a narrow integration. None of these grants human authority for production, destructive, financial, privacy-sensitive, or externally visible actions.

## Common selection patterns

| Situation | Start with | Add only when needed |
| --- | --- | --- |
| A bounded implementation or review task | One applicable rule and one task skill | A role when there are handoffs or broader responsibility. |
| A cross-cutting delivery outcome | One primary role plus discipline rules | A specialist role for independent review, not duplicate decision ownership. |
| A production, security, or high-autonomy change | Role, constraints, and a targeted procedure | One kit/guard whose threat model matches the risk and whose host adapter can be implemented. |
| Work against an external provider | The provider's complete MCP directory | A scoped credential, allowlist, explicit approval owner, and read-only validation path. |
| A new or unusual discipline | The closest role package and target-repository policy | A new standalone Rule or Skill only after the procedure is reusable across projects. |

## Role-to-companion map

Use this map to find the nearest reusable companion. A dash means the role package is currently the authoritative starting point; do not silently substitute a similarly named discipline with a different scope.

| Outcome / primary role | Rules to consider | Skills to consider | Selection note |
| --- | --- | --- | --- |
| Agent Engineer, Prompt Engineer | [`agent-engineer`](../Rules/agent-engineer/), [`ai-engineer`](../Rules/ai-engineer/) | [`agent-engineer`](../Skills/agent-engineer/), [`ai-engineer`](../Skills/ai-engineer/) | Use the prompt role for instruction/output contracts and the agent role for tools, state, delegation, and recovery. |
| AI Security Engineer, Solution Architect AI | [`security-engineer`](../Rules/security-engineer/), `agent-engineer`, `ai-engineer` | [`security-engineer`](../Skills/security-engineer/), `agent-engineer`, `ai-engineer` | Add a security/performance kit when a runtime boundary or evidence gate is needed. |
| .NET Backend Developer | [`dotnet-backend-developer`](../Rules/dotnet-backend-developer/) | [`dotnet-backend-developer`](../Skills/dotnet-backend-developer/) | Pair with API or data controls only when the change reaches those boundaries. |
| Full-stack Developer | `.NET` and/or [`react-developer`](../Rules/react-developer/) | `.NET` and/or [`react-developer`](../Skills/react-developer/) | Select only the frontend and backend portions actually present in the target. |
| React Frontend Developer | `react-developer` | `react-developer` | Add accessibility rules/skills for user-facing behavior. |
| Angular or Vue implementation | Target-repository frontend rules | [`angular-developer`](../Skills/angular-developer/) or [`vue-developer`](../Skills/vue-developer/) | These framework skills are intentionally procedure-focused; add repository-specific security, accessibility, and test constraints. |
| Mobile Application Developer | Target-repository mobile/platform policy | — | The complete role package owns platform lifecycle, offline behavior, privacy, and release concerns. |
| QA Automation Engineer | [`qa-automation-engineer`](../Rules/qa-automation-engineer/) | [`qa-automation-engineer`](../Skills/qa-automation-engineer/) | Add a kit only for a concrete test gate, fixture, or evidence requirement. |
| Data Engineer | [`data-engineer`](../Rules/data-engineer/) | [`data-engineer`](../Skills/data-engineer/) | Add database rules/skills when changing storage behavior. |
| Data Analyst | [`data-scientist`](../Rules/data-scientist/) when analytical-model controls apply | [`data-analyst`](../Skills/data-analyst/) | Do not apply data-science rules to routine reporting unless their model or experiment scope is relevant. |
| Database Engineer | [`database-engineer`](../Rules/database-engineer/) | [`database-engineer`](../Skills/database-engineer/) | Use a gate for irreversible migrations, sensitive data, or production evidence. |
| Machine-learning work | [`machine-learning-engineer`](../Rules/machine-learning-engineer/) | [`machine-learning-engineer`](../Skills/machine-learning-engineer/) | Pair with AI/agent assets only for an actual model or agent boundary. |
| Azure Cloud Engineer | [`azure-engineer`](../Rules/azure-engineer/), [`cloud-engineer`](../Rules/cloud-engineer/) | [`cloud-engineer`](../Skills/cloud-engineer/), [`devops-engineer`](../Skills/devops-engineer/) | Use the Azure rules for provider controls; the Cloud and DevOps skills cover reusable delivery procedures. |
| AWS Cloud work | [`aws-engineer`](../Rules/aws-engineer/), `cloud-engineer` | `cloud-engineer`, `devops-engineer` | Keep provider-specific policy separate from general deployment procedure. |
| DevOps Engineer | [`devops-engineer`](../Rules/devops-engineer/) | [`devops-engineer`](../Skills/devops-engineer/) | Add release controls only at promotion, rollback, or artifact boundaries. |
| Platform Engineer | [`platform-engineer`](../Rules/platform-engineer/) | `devops-engineer`, `site-reliability-engineer` | The role package remains the source for platform-product and golden-path workflow. |
| Cloud FinOps Engineer | `cloud-engineer`, provider rules as applicable | `cloud-engineer` | The role package owns cost allocation, commitments, and realized-savings evidence. |
| Observability Engineer | [`observability-engineer`](../Rules/observability-engineer/) | [`observability-engineer`](../Skills/observability-engineer/) | Do not replace observability design with alert configuration alone. |
| Performance Engineer | [`performance-engineer`](../Rules/performance-engineer/) | [`performance-engineer`](../Skills/performance-engineer/) | Add a performance kit only after a measurable workload and baseline are defined. |
| Site Reliability Engineer, Incident Commander | [`site-reliability-engineer`](../Rules/site-reliability-engineer/), `performance-engineer` | [`site-reliability-engineer`](../Skills/site-reliability-engineer/), `performance-engineer` | Keep incident command decision ownership separate from implementation work. |
| Release Engineer | [`release-engineer`](../Rules/release-engineer/), `devops-engineer` | [`release-engineer`](../Skills/release-engineer/), `devops-engineer` | Choose Release Manager or Release Engineering Manager only when coordination or governance becomes the primary outcome. |
| Release Manager, Release Engineering Manager | [`project-manager`](../Rules/project-manager/), [`engineering-manager`](../Rules/engineering-manager/) | `release-engineer`, `devops-engineer` | Their complete role packages are authoritative for calendar, exception, and governance workflows. |
| Security Engineer | `security-engineer` | `security-engineer` | Security procedures support only authorized defensive work and do not grant testing access. |
| Software Architect, Solution Architect, Enterprise Architect | [`software-architect`](../Rules/software-architect/), [`solution-architect`](../Rules/solution-architect/) | [`software-architect`](../Skills/software-architect/), [`solution-architect`](../Skills/solution-architect/) | Use Enterprise Architect for portfolio governance; do not use it as a substitute for implementation design. |
| Technical Lead | [`technical-lead`](../Rules/technical-lead/) | [`technical-lead`](../Skills/technical-lead/) | Keep one delivery owner even when specialists review. |
| Engineering Manager | `engineering-manager` | — | The full role package is the reusable source for staffing-aware leadership and stakeholder decisions. |
| Product Manager, API Product Manager | [`product-manager`](../Rules/product-manager/), `solution-architect` for API contracts | [`product-manager`](../Skills/product-manager/), `solution-architect` | Add a connector only for a specific approved source of product evidence. |
| Product Owner | [`product-owner`](../Rules/product-owner/) | [`product-owner`](../Skills/product-owner/) | Use Product Manager assets only for discovery, market, or outcome decisions outside backlog ownership. |
| Business Analyst | [`business-analyst`](../Rules/business-analyst/) | [`business-analyst`](../Skills/business-analyst/) | Use traceability and acceptance evidence before implementation begins. |
| Project Manager, Scrum Master, Technical Program Manager | `project-manager`, `technical-lead` where delivery design is involved | `technical-lead`, `product-owner` when relevant | Their roles are the primary source for facilitation, cross-team dependencies, and escalation. |
| Accessibility Engineer, UX Designer | [`accessibility-engineer`](../Rules/accessibility-engineer/) | [`accessibility-engineer`](../Skills/accessibility-engineer/) | The UX role remains authoritative for research and interaction design; accessibility assets govern inclusive implementation and review. |
| Technical Writer, Content Strategist, Developer Advocate | [`technical-writer`](../Rules/technical-writer/) | — | Use the Writer role for a complete documentation workflow; content and advocacy roles have their own audience and lifecycle concerns. |
| Customer Success Engineer, Sales Engineer, Growth Marketer | `solution-architect` where solution design is involved | `solution-architect` where technical validation is involved | The primary roles define customer, commercial, consent, and communication boundaries; do not borrow product or project roles as authority. |
| Technical Researcher | `data-scientist`, `software-architect` when applicable | `machine-learning-engineer`, `software-architect` when applicable | Start with the role for evidence standards; add specialist documents only for the actual research domain. |

## What the audit added

The review found several reusable role capabilities that were only available inside a complete role package. The following standalone companions now make common one-off work selectable without importing the entire role:

- Accessibility: conformance rules and feature-review procedure.
- Observability: telemetry/alerting rules and telemetry-design procedure.
- Release engineering: safety rules and readiness procedure.
- Product ownership: backlog and acceptance constraints.
- Data analysis: a decision-analysis procedure.

The remaining role-only areas are intentional until a procedure proves broadly reusable. Creating a generic standalone document too early would hide role-specific approvals, evidence, and handoffs rather than help adopters.

## Add a kit or MCP only at the boundary

Engineering kits and MCP connectors are the most likely assets to be over-selected. Use a kit only when its documented problem statement matches a measurable risk such as permission escalation, unsafe tool execution, untrusted context, evaluation quality, performance regression, or evidence integrity. Use a connector only for one provider and only after the target repository defines credentials, allowlists, approvals, rate limits, logging, and revocation.

For exact copy boundaries, sparse checkout, target layout, provenance, and update steps, see the [adoption guide](ADOPTION_GUIDE.md).
