# Machine Learning Engineer Rules

Operating constraints for AI-assisted work performed in the Machine Learning Engineer discipline. These files are policy guidance, require no installation, and should be combined with repository-specific instructions and deterministic checks.

Each rule file is self-contained and may be copied independently; this README and the sibling rules are navigation and optional context, not runtime dependencies.

## Usage

1. Select the smallest set of rules that covers the model, data, training, evaluation, serving, or operational change.
2. Resolve conflicts using repository policy, explicit approval boundaries, and the stricter safety, privacy, fairness, or production requirement.
3. Where available, optionally pair the rules with relevant machine-learning, AI, data, platform, SRE, or security procedures.
4. Convert critical requirements into dataset checks, reproducible pipelines, evaluation gates, registry policy, deployment controls, tests, and monitoring.

## Catalogue

- [Bias and Fairness Rules](bias-fairness-rules.md)
- [Data Leakage Rules](data-leakage-rules.md)
- [Data Quality Rules](data-quality-rules.md)
- [Dataset Versioning Rules](dataset-versioning-rules.md)
- [Dependency and Environment Rules](dependency-environment-rules.md)
- [Deployment Safety Rules](deployment-safety-rules.md)
- [Drift Monitoring Rules](drift-monitoring-rules.md)
- [Experiment Governance Rules](experiment-governance-rules.md)
- [Feature Engineering Rules](feature-engineering-rules.md)
- [Human Approval Rules](human-approval-rules.md)
- [ML Incident Response Rules](incident-response-rules.md)
- [Inference Performance Rules](inference-performance-rules.md)
- [Model Calibration Rules](model-calibration-rules.md)
- [Model Evaluation Rules](model-evaluation-rules.md)
- [Model Registry Rules](model-registry-rules.md)
- [ML Observability Rules](observability-rules.md)
- [Problem Framing Rules](problem-framing-rules.md)
- [Retraining Rules](retraining-rules.md)
- [Security and Privacy Rules](security-privacy-rules.md)
- [Serving Contract Rules](serving-contract-rules.md)
- [ML Testing Rules](testing-rules.md)
- [Training Reproducibility Rules](training-reproducibility-rules.md)

## Maintenance

When adding a rule, keep it focused, link it from this index, preserve the surrounding terminology, and document verification, evidence, ownership, and approval boundaries. Follow the host repository's contribution policy when one exists.
