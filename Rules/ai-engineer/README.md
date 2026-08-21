# AI Engineer Rules

Operating constraints for AI-assisted work performed in the AI Engineer discipline. These files are policy guidance, require no installation, and should be combined with repository-specific instructions and deterministic checks.

Each rule file is self-contained and may be copied independently; this README and the sibling rules are navigation and optional context, not runtime dependencies.

## Usage

1. Select the smallest set of rules that covers the planned change.
2. Resolve conflicts using repository policy, explicit approval boundaries, and the stricter safety requirement.
3. Where available, optionally pair the rules with matching AI engineering procedures.
4. Convert critical requirements into tests, hooks, or CI checks in the target repository.

## Catalogue

- [Context Management Rules](context-management-rules.md)
- [Cost and Token Rules](cost-token-rules.md)
- [Evaluation Rules](evaluation-rules.md)
- [Fallback and Resilience Rules](fallback-resilience-rules.md)
- [Hallucination and Grounding Rules](hallucination-grounding-rules.md)
- [Human Approval Rules](human-approval-rules.md)
- [AI Incident Response Rules](incident-response-rules.md)
- [Latency and Performance Rules](latency-performance-rules.md)
- [Model Selection Rules](model-selection-rules.md)
- [AI Observability Rules](observability-rules.md)
- [Privacy and Data Rules](privacy-data-rules.md)
- [Production Release Rules](production-release-rules.md)
- [Prompt Design Rules](prompt-design-rules.md)
- [Provider Dependency Rules](provider-dependency-rules.md)
- [RAG Retrieval Rules](rag-retrieval-rules.md)
- [Safety Guardrail Rules](safety-guardrail-rules.md)
- [AI Security Rules](security-rules.md)
- [Structured Output Rules](structured-output-rules.md)
- [AI Testing Rules](testing-rules.md)
- [Tool Use Rules](tool-use-rules.md)

## Maintenance

When adding a rule, keep it focused, link it from this index, preserve the surrounding terminology, and document verification and approval boundaries. Follow the host repository's contribution policy when one exists.
