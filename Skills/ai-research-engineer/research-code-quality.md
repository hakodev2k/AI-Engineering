# Research Code Quality

## Purpose
Keep AI research code fast to change without sacrificing correctness, traceability, or the ability to distinguish algorithmic results from implementation defects. This skill defines a Senior-level standard between disposable prototypes and over-engineered production systems.

## When to use
Use when a prototype becomes the basis for repeated experiments, when multiple researchers share code, when results are difficult to reproduce, before scaling an experiment, or before handing work to engineering teams.

## Inputs
- Research repository
- Experiment configurations
- Tests and evaluation scripts
- Known research variables
- Repeated pain points or bugs

## Preconditions
Identify which parts of the code encode the research hypothesis and which are stable infrastructure. Avoid broad refactoring while a confirmatory experiment is running unless correctness requires it.

## Context to inspect
Inspect module boundaries, configuration handling, dependency versions, notebooks, duplicated training logic, hidden global state, mutable defaults, data preprocessing, checkpoint compatibility, test coverage, experiment logging, and code paths that differ between baseline and treatment.

## Core knowledge
Research code should optimize for inspectability and experimental integrity. Excessive abstraction can hide research-critical behavior, while copy-paste variants create silent divergence. The highest-value tests target invariants, numerical equivalence, data integrity, checkpoint/resume, and evaluation correctness rather than generic line coverage.

## Procedure
1. Map the end-to-end experiment path from data to reported metric.
2. Identify research-critical functions whose behavior changes the scientific claim.
3. Remove duplicated baseline/treatment code when duplication risks unintended differences.
4. Keep experimental interventions explicit rather than buried behind generic factories.
5. Move hyperparameters and run settings into versioned, serializable configuration.
6. Add assertions for tensor shapes, masks, label ranges, token/sample counts, and invalid numerical states.
7. Add unit tests for deterministic transformations and metric calculations.
8. Add integration tests for a tiny end-to-end training/evaluation run.
9. Add equivalence tests when replacing a reference implementation with an optimized path.
10. Make random seeds and external artifact identifiers explicit.
11. Separate notebooks used for analysis from authoritative training/evaluation entry points.
12. Pin dependencies and document environment assumptions.
13. Add linting or static checks only where they reduce real research defects and review friction.
14. Review changes for accidental baseline/treatment asymmetry.
15. Refactor incrementally and rerun representative regression experiments after material changes.

## Decision points
- Abstract stable repeated infrastructure; keep novel mechanisms locally readable.
- Prefer a small amount of duplication over a complicated abstraction when variants are genuinely diverging.
- Promote code toward production standards when it becomes shared infrastructure or a handoff artifact.
- Keep notebooks for exploration, but do not rely on hidden notebook state for authoritative results.

## Common failure patterns
- Treating all research code as disposable.
- Refactoring before preserving reference behavior.
- Building a large framework around a single experiment.
- Hiding experiment differences in defaults.
- Copying evaluation code into multiple variants.
- Tests that only verify code runs, not that math or data semantics are correct.
- Breaking old checkpoints without migration or explicit incompatibility.

## Verification
Quality work is implemented when code is clearer and tests execute. It is verified when reference results remain within expected tolerance, experiment configs are reconstructible, baseline/treatment differences are inspectable, critical invariants are tested, and a second researcher can run the experiment without manual hidden state.

## Expected output
A maintainable research codebase with explicit experiment configuration, targeted correctness tests, stable entry points, environment pinning, and documented intentional differences between experimental variants.

## Stop conditions
Stop refactoring when changes cannot be validated against reference behavior, when the scientific intervention itself is still undefined, when checkpoint/data compatibility would be destructively changed without approval, or when cleanup threatens an active time-critical experiment.