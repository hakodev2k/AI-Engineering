# Training Reproducibility Rules

## Purpose
Make model builds explainable, repeatable within defined tolerances, and suitable for controlled promotion.

## Scope
Applies to training, fine-tuning, feature generation, preprocessing, and packaging pipelines.

## MUST
- Training runs MUST capture source revision, configuration, random seeds where meaningful, input dataset versions, preprocessing versions, runtime image, dependency lock state, hardware/runtime class, and output artifact digest.
- Nondeterministic operations MUST be identified when they can materially change evaluation or release decisions.
- Reproduction criteria MUST define acceptable tolerance rather than claim bitwise reproducibility where the stack cannot provide it.
- Release candidates MUST be reconstructable from versioned inputs and automation.

## MUST NOT
- Production candidates MUST NOT depend on undocumented notebook state, local files, mutable data references, or manually installed packages.
- Failed reproduction MUST NOT be hidden by selecting only favorable reruns.

## SHOULD
- Critical training pipelines SHOULD run in immutable containers and persist machine-readable run manifests.
- Reproduction checks SHOULD be automated for representative releases.

## Exceptions
Exploratory work may relax full capture, but an artifact MUST satisfy release reproducibility requirements before promotion. Other exceptions require documented reason, evidence, risk, and approval.

## Verification
Re-run a representative candidate from recorded inputs; compare lineage, environment manifest, metrics, and declared tolerances. Review CI logs for provenance capture and immutable dependency resolution.