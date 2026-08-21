# Agent Engineer Rules

Operating constraints for designing, integrating, evaluating, and operating AI agents. These files are policy guidance, require no installation, and should be combined with repository-specific instructions and deterministic enforcement.

## Usage

1. Select the smallest set of rules that covers the agent behavior or platform change.
2. Define authority, data, tool, cost, reliability, and human-approval boundaries before execution.
3. Pair these rules with the related [AI Engineer skills](../../Skills/ai-engineer/) where appropriate.
4. Convert critical requirements into runtime policy, tests, hooks, telemetry, or CI gates.

## Catalogue

- [Agent Architecture Rules](agent-architecture-rules.md)
- [Authority Boundary Rules](authority-boundary-rules.md)
- [Change Governance Rules](change-governance-rules.md)
- [Context and Retrieval Rules](context-retrieval-rules.md)
- [Cost and Performance Rules](cost-performance-rules.md)
- [Data Privacy Rules](data-privacy-rules.md)
- [Agent Evaluation Rules](evaluation-rules.md)
- [Fallback and Degradation Rules](fallback-degradation-rules.md)
- [Human-in-the-Loop Rules](human-in-the-loop-rules.md)
- [Agent Incident Response Rules](incident-response-rules.md)
- [Multi-Agent Coordination Rules](multi-agent-coordination-rules.md)
- [Agent Observability Rules](observability-rules.md)
- [Planning and Reasoning Rules](planning-reasoning-rules.md)
- [Production Release Rules](production-release-rules.md)
- [Prompt Injection Rules](prompt-injection-rules.md)
- [Prompt and Instruction Rules](prompt-instruction-rules.md)
- [Reliability and Retry Rules](reliability-retry-rules.md)
- [Safety Guardrail Rules](safety-guardrail-rules.md)
- [Agent Security Rules](security-rules.md)
- [State and Memory Rules](state-memory-rules.md)
- [Agent Testing Rules](testing-rules.md)
- [Tool Contract Rules](tool-contract-rules.md)

## Maintenance

When adding a rule, keep it focused, link it from this index, preserve the surrounding terminology, and document verification and approval boundaries. See the repository [contribution guide](../../CONTRIBUTING.md).

