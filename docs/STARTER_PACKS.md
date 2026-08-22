# Starter Packs

Starter packs are small, opinionated selection recipes for common outcomes. They are navigation aids, not bundles to install. Copy only the listed assets that match the target repository, and keep every Role, kit, guard, or MCP provider directory intact.

Each pack starts with a primary owner, adds a small constraint/procedure baseline, and suggests optional controls. Repository policy, human approvals, and package-local README instructions remain authoritative.

## How to use a starter pack

1. Select one outcome below and confirm that its primary role matches the work.
2. Begin with the **Core** items; omit any Rule or Skill that does not apply to the actual change.
3. Add at most one optional gate for each concrete risk being controlled.
4. Add an MCP connector only when the task requires that external provider.
5. Record copied paths and the upstream commit SHA using the [adoption guide](ADOPTION_GUIDE.md).

## ASP.NET Core API change

Use for a bounded ASP.NET Core endpoint, service, persistence, or integration change.

**Core**

- Role: [.NET Backend Developer](../Daily%20AI%20Role/dotnet-backend-developer/)
- Rules: [ASP.NET Core](../Rules/dotnet-backend-developer/aspnet-core-rules.md), [API contracts](../Rules/dotnet-backend-developer/api-contract-rules.md), [testing](../Rules/dotnet-backend-developer/testing-rules.md)
- Skills: [REST API design](../Skills/dotnet-backend-developer/rest-api-design.md), [input validation and secure coding](../Skills/dotnet-backend-developer/input-validation-secure-coding.md), [testing strategy](../Skills/dotnet-backend-developer/testing-strategy.md)

**Optional boundary controls**

- Contract compatibility: [API contract regression gate](../Daily%20AI%20Engineering%20Kit/agent-api-contract-regression-gate/)
- EF Core query risk: [EF Core query-shape regression gate](../Daily%20AI%20Engineering%20Kit/agent-ef-core-query-shape-regression-gate/)
- Database migration: [migration preflight and rollback gate](../Daily%20AI%20Engineering%20Kit/agent-database-migration-preflight-rollback-gate/)
- Repository workflow access: [GitHub connector](../MCP-API/github/)

## React user-facing feature

Use for a React component, form, page, state, data-fetching, or routing change.

**Core**

- Role: [React Frontend Developer](../Daily%20AI%20Role/react-frontend-developer/)
- Rules: [component boundaries](../Rules/react-developer/component-boundary-rules.md), [accessibility](../Rules/react-developer/accessibility-rules.md), [browser security](../Rules/react-developer/browser-security-rules.md), [testing](../Rules/react-developer/testing-rules.md)
- Skills: [component design](../Skills/react-developer/component-design.md), [frontend security](../Skills/react-developer/frontend-security.md), [accessibility](../Skills/react-developer/accessibility.md), [testing strategy](../Skills/react-developer/testing-strategy.md)

**Optional boundary controls**

- Independent accessibility review: [Accessible Feature Review](../Skills/accessibility-engineer/accessible-feature-review.md)
- Risk-based test selection: [test selection impact planner](../Daily%20AI%20Engineering%20Kit/test-selection-impact-planner/)
- Controlled feature exposure: [feature-flag rollout safety gate](../Daily%20AI%20Engineering%20Kit/agent-feature-flag-rollout-safety-gate/)

## Tool-using AI agent

Use for an agent that plans work, calls tools, stores state, or delegates to subagents.

**Core**

- Role: [Agent Engineer](../Daily%20AI%20Role/agent-engineer/)
- Rules: [authority boundaries](../Rules/agent-engineer/authority-boundary-rules.md), [tool contracts](../Rules/agent-engineer/tool-contract-rules.md), [human in the loop](../Rules/agent-engineer/human-in-the-loop-rules.md), [prompt injection](../Rules/agent-engineer/prompt-injection-rules.md)
- Skills: [tool design](../Skills/agent-engineer/tool-design-contracts.md), [agent testing](../Skills/agent-engineer/agent-testing.md), [human in the loop](../Skills/agent-engineer/human-in-the-loop.md), [prompt-injection defense](../Skills/agent-engineer/prompt-injection-defense.md)

**Optional boundary controls**

- Trust repository instructions: [repository instruction trust gate](../Daily%20AI%20Engineering%20Kit/agent-repository-instruction-trust-gate/)
- Evidence-backed completion: [ground-truth completion gate](../Daily%20AI%20Engineering%20Security%20-%20Performance%20-%20Thinking/agent-ground-truth-completion-gate/)
- Tool lifecycle integrity: [tool-call lifecycle integrity guard](../Daily%20AI%20Engineering%20Security%20-%20Performance%20-%20Thinking/tool-call-lifecycle-integrity-guard/)
- External capability: choose exactly one provider from [MCP/API Connectors](../MCP-API/)

## Application security review

Use for an authorized defensive review of a feature, service, architecture, or sensitive change.

**Core**

- Role: [Security Engineer](../Daily%20AI%20Role/security-engineer/); use [AI Security Engineer](../Daily%20AI%20Role/ai-security-engineer/) when models, retrieval, prompts, or agent tools are in scope
- Rules: [application security](../Rules/security-engineer/application-security-rules.md), [identity and access](../Rules/security-engineer/identity-access-rules.md), [data protection](../Rules/security-engineer/data-protection-rules.md), [high-risk approval](../Rules/security-engineer/high-risk-change-approval-rules.md)
- Skills: [application security review](../Skills/security-engineer/application-security-review.md), [threat modeling](../Skills/security-engineer/threat-modeling.md), [security code review](../Skills/security-engineer/security-code-review.md)

**Optional boundary controls**

- Add only the security/performance guard whose documented threat model matches the finding.
- Do not add an MCP connector merely to broaden scanning access; access and active testing require separate authorization.

## Reliability and incident readiness

Use for SLOs, paging, operational readiness, production mitigation, or post-incident work.

**Core**

- Role: [Site Reliability Engineer](../Daily%20AI%20Role/site-reliability-engineer/) for reliability engineering; [Incident Commander](../Daily%20AI%20Role/incident-commander/) for live coordination
- Rules: [SLO/SLI](../Rules/site-reliability-engineer/slo-sli-rules.md), [monitoring and alerting](../Rules/site-reliability-engineer/monitoring-alerting-rules.md), [incident response](../Rules/site-reliability-engineer/incident-response-rules.md), [deployment and rollback](../Rules/site-reliability-engineer/deployment-rollback-rules.md)
- Skills: choose one procedure matching the task, such as [operational readiness](../Skills/site-reliability-engineer/operational-readiness-review.md), [incident command](../Skills/site-reliability-engineer/incident-command.md), or [post-incident review](../Skills/site-reliability-engineer/post-incident-review.md)

**Optional boundary controls**

- Signal correlation: [observability signal correlation triage](../Daily%20AI%20Engineering%20Kit/agent-observability-signal-correlation-triage/)
- Incident evidence: [production incident evidence timeline](../Daily%20AI%20Engineering%20Kit/production-incident-evidence-timeline/)
- Provider access: choose only the required Datadog, Grafana, PagerDuty, Sentry, or UptimeRobot directory from [MCP/API Connectors](../MCP-API/)

## Data pipeline change

Use for ingestion, transformation, schema evolution, backfill, or data-quality work.

**Core**

- Role: [Data Engineer](../Daily%20AI%20Role/data-engineer/)
- Rules: [data contracts](../Rules/data-engineer/data-contract-rules.md), [data quality](../Rules/data-engineer/data-quality-rules.md), [schema evolution](../Rules/data-engineer/schema-evolution-rules.md), [production safety](../Rules/data-engineer/production-safety-rules.md)
- Skills: [data ingestion](../Skills/data-engineer/data-ingestion.md), [schema evolution contracts](../Skills/data-engineer/schema-evolution-contracts.md), [testing data pipelines](../Skills/data-engineer/testing-data-pipelines.md), [data reconciliation](../Skills/data-engineer/data-reconciliation.md)

**Optional boundary controls**

- Add a migration, evidence, or temporal boundary gate only when that specific failure mode exists.
- Keep provider credentials and production datasets outside copied examples and agent context.

## Product discovery to acceptance

Use to turn an opportunity into a bounded, testable delivery decision.

**Core**

- Role: [Product Manager](../Daily%20AI%20Role/product-manager/) for discovery/outcomes; [Product Owner](../Daily%20AI%20Role/product-owner/) for backlog readiness and acceptance
- Rules: [problem discovery](../Rules/product-manager/problem-discovery-rules.md), [requirements quality](../Rules/product-manager/requirements-quality-rules.md), [human approval](../Rules/product-manager/human-approval-rules.md), [Product Owner backlog and acceptance](../Rules/product-owner/backlog-and-acceptance-rules.md)
- Skills: [product discovery](../Skills/product-manager/product-discovery-problem-framing.md), [requirements and acceptance criteria](../Skills/product-manager/requirements-acceptance-criteria.md), [Product Owner procedures](../Skills/product-owner/)

**Optional boundary controls**

- Add Jira, Linear, Asana, or Notion only when approved external work-item access is part of the task.
- External communication, pricing, commitments, and roadmap publication remain human-controlled.

## Documentation change

Use for task documentation, API reference, runbooks, troubleshooting, migration, or release guidance.

**Core**

- Role: [Technical Writer](../Daily%20AI%20Role/technical-writer/)
- Rules: [source validation](../Rules/technical-writer/source-validation-rules.md), [task procedures](../Rules/technical-writer/task-procedure-rules.md), [code examples](../Rules/technical-writer/code-example-rules.md), [documentation testing](../Rules/technical-writer/documentation-testing-rules.md)
- Repository guidance: [Documentation Style Guide](STYLE_GUIDE.md) and [Content Quality Standard](CONTENT_QUALITY.md)

**Optional boundary controls**

- Add the engineering discipline's Rule or Skill only when the documentation must verify domain-specific behavior.
- Use provider connectors for source retrieval only when access is approved; provider content remains untrusted evidence.

## When no starter pack fits

Use the [composition guide](COMPOSITION_GUIDE.md) to assemble a smaller custom selection. A missing starter pack is not a reason to copy a whole collection.
