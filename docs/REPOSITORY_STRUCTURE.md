# Repository Structure

The repository separates behavioral guidance, enforcement packages, role context, and external integrations so adopters can compose only what they need.

## Top-level map

```text
AI-Engineering/
├── Daily AI Engineering Kit/
├── Daily AI Engineering Security - Performance - Thinking/
├── Daily AI Role/
├── MCP-API/
├── Rules/
├── Skills/
├── docs/
├── scripts/
├── .github/
└── repository policy and metadata files
```

## Collection responsibilities

| Collection | Owns | Does not replace |
| --- | --- | --- |
| `Daily AI Engineering Kit` | Reusable gates, guards, workflows, schemas, scripts, tests, and evidence. | Target-repository implementation and production review. |
| `Daily AI Engineering Security - Performance - Thinking` | Advanced agent security, context, orchestration, performance, and runtime-integrity controls. | Host-level sandboxing, authorization, or monitoring. |
| `Daily AI Role` | Missions, responsibilities, boundaries, workflows, and expected outputs for a role. | Human accountability or organization policy. |
| `MCP-API` | Narrow connectors to supported external providers. | Provider administration or unrestricted API access. |
| `Rules` | Mandatory discipline-specific constraints. | Deterministic enforcement in the target repository. |
| `Skills` | Focused procedures for completing common engineering tasks. | Task requirements, acceptance criteria, or authorization. |

## Composition model

```text
Task objective
  -> one accountable role
  -> relevant rules
  -> task-specific skills
  -> risk-specific gate or guard
  -> optional least-privilege connector
  -> deterministic verification and human approvals
```

Start small. Loading unrelated roles, rules, or skills can increase context size and introduce conflicting assumptions.

## Package maturity

A package may be:

- **Guidance-only:** Markdown rules, skills, workflows, or research with no executable component.
- **Executable reference:** scripts and tests that demonstrate or validate a behavior locally.
- **Connector:** a runnable integration requiring installation, credentials, permissions, and provider-specific review.

An executable reference is not automatically production-ready. Its README should identify the runtime, dependencies, configuration, commands, exit behavior, limitations, and verification path.

## Where new content belongs

- Repository policy or cross-collection guidance: root or `docs/`.
- A new discipline constraint: `Rules/<discipline>/`.
- A reusable task procedure: `Skills/<discipline>/`.
- A full operating persona: `Daily AI Role/<role>/`.
- A reusable gate or evidence workflow: the appropriate engineering kit.
- An external provider integration: `MCP-API/<provider>/`.

See [STYLE_GUIDE.md](STYLE_GUIDE.md) before adding documentation and [CONTRIBUTING.md](../CONTRIBUTING.md) before opening a pull request.
