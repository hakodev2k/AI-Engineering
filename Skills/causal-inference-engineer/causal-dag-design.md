# Causal DAG Design

## Purpose
Use directed acyclic graphs (DAGs) to encode causal assumptions, reason about bias, and derive admissible adjustment sets.

## When to use
Use before observational adjustment, when reviewing covariate choices, or when multiple causal pathways create ambiguity. Do not treat a DAG learned from correlations as automatically causal.

## Inputs
- Domain assumptions
- Treatment, outcome, candidate covariates
- Temporal ordering
- Data-generating process knowledge

## Context to inspect
Inspect variables measured before and after treatment, common causes, mediators, selection mechanisms, missingness, proxies, and latent variables.

## Core knowledge
Understand d-separation, backdoor paths, colliders, mediators, descendants, confounding, selection bias, and Markov equivalence. DAGs document assumptions; they do not prove them.

## Procedure
1. Define treatment and outcome first.
2. Add causes of treatment and outcome using domain knowledge.
3. Respect temporal ordering.
4. Mark latent/unmeasured common causes explicitly.
5. Identify all open backdoor paths.
6. Derive minimally sufficient adjustment sets.
7. Exclude colliders and post-treatment mediators unless estimating a mediated effect.
8. Review alternative plausible DAGs.
9. Compare conclusions across those alternatives.
10. Record assumptions that cannot be empirically verified.

## Decision points
Use a minimal adjustment set to reduce variance and accidental bias, unless robustness or transportability requires additional pre-treatment covariates. If alternative DAGs imply different estimands, escalate the assumption dispute rather than hide it in modeling.

## Common failure patterns
- Adjusting for every available variable
- Conditioning on colliders
- Treating mediators as baseline confounders
- Ignoring selection nodes
- Drawing arrows from correlation rather than causal knowledge

## Verification
Verify each adjusted variable has a causal rationale and that all backdoor paths are blocked without opening new non-causal paths.

## Expected output
A reviewed DAG, adjustment set, excluded-variable rationale, and list of untestable assumptions.

## Stop conditions
Stop when temporal order or key causal relationships are unknown enough that materially different DAGs remain unresolved.