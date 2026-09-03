# Generation Method Selection Rules

## Purpose
Choose generation methods based on requirements, risk, and evidence rather than novelty or convenience.

## Scope
Applies to procedural generators, simulators, rule-based systems, statistical models, generative neural models, diffusion models, language models, tabular synthesizers, and hybrid approaches.

## MUST
- Map the generation method to required data properties, privacy needs, controllability, explainability, scalability, and downstream utility.
- Compare at least one simpler baseline against materially more complex approaches when complexity increases operational or validation risk.
- Document assumptions the method makes about distributions, dependencies, temporal structure, labels, and missingness.
- Validate that the method can represent required rare cases and constraints before large-scale production.
- Record known failure modes and conditions under which the method must not be used.

## MUST NOT
- Select a method solely because it is state of the art, vendor-preferred, or already available.
- Use an opaque generator for high-risk data without adequate validation and monitoring controls.
- Assume one generation technique is appropriate for all modalities or downstream tasks.
- Hide method limitations behind aggregate realism metrics.

## SHOULD
- Prefer the least complex method that satisfies quality and safety requirements.
- Use hybrid generation when explicit constraints and learned distributions must both be preserved.
- Evaluate maintainability, reproducibility, licensing, compute cost, and operational ownership as selection criteria.

## Exceptions
A selection that bypasses baseline comparison or uses an unvalidated method requires documented rationale, risk analysis, expected benefit, and reviewer approval.

## Verification
Inspect design records, baseline comparisons, method-specific validation results, failure-mode analysis, and evidence that chosen controls match the method's known risks.