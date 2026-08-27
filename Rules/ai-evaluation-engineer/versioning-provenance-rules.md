# Versioning and Provenance Rules

## Purpose
Preserve trustworthy lineage for every evaluated AI artifact and result.

## Scope
Applies to models, prompts, policies, tools, retrieval indexes, datasets, evaluators, run configurations, and reported results.

## MUST
- Every evaluation result used for a consequential decision MUST identify the exact evaluated system configuration.
- Model aliases that can move over time MUST be resolved to stable version information where the provider exposes it.
- Prompt, policy, tool schema, retrieval, and evaluator changes MUST be versioned when they can affect outcomes.
- Result artifacts MUST link to immutable or uniquely identifiable inputs whenever practical.
- Provenance gaps that prevent reliable comparison MUST be disclosed before results are used for release decisions.

## MUST NOT
- MUST NOT label results with only a product nickname when multiple materially different configurations share that name.
- MUST NOT mix outputs from different system versions into one benchmark result without explicit stratification.
- MUST NOT retroactively alter provenance metadata to make incompatible runs appear comparable.

## SHOULD
- Run identifiers SHOULD be globally unique within the evaluation program.
- Evaluation dashboards SHOULD expose the principal artifact versions behind every displayed score.

## Exceptions
Exploratory experiments may use temporary identifiers, but any result promoted into a decision record MUST be assigned durable provenance.

## Verification
Inspect run manifests, artifact hashes or version IDs, prompt and policy revisions, model identifiers, dataset references, and dashboard links. Confirm a sampled score can be traced back to the exact evaluated configuration.