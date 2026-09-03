# Toolchain Reproducibility Rules

## Purpose
Make formal verification results reproducible, attributable, and resistant to hidden toolchain drift.

## Scope
Applies to proof assistants, model checkers, SMT solvers, translators, generators, preprocessors, plugins, and verification build environments.

## MUST
- Pin or record tool versions and materially relevant solver or checker options for assurance-significant runs.
- Preserve source specifications, generated verification inputs, commands, and result artifacts needed to replay critical claims.
- Review tool upgrades for semantic, proof-kernel, parser, encoding, and default-option changes.
- Run critical verification from a clean environment or reproducible build context before release decisions.
- Identify trusted computing base components and externally trusted transformations.

## MUST NOT
- Treat a changed toolchain as equivalent without regression evidence.
- Depend on undocumented local configuration for release-critical verification.
- Delete the only reproducible evidence of a material verification result.

## SHOULD
- Automate environment creation and verification execution.
- Use checksums, lockfiles, containers, or equivalent mechanisms to detect drift where appropriate.

## Exceptions
Emergency tool substitution requires documented reason, comparison evidence, residual risk, and approval before affected results support a critical decision.

## Verification
Re-run verification in a clean environment, inspect version manifests and configuration, compare generated inputs/results, and review trusted-component changes.