# Reproducible Build Rules

## Purpose
Reduce hidden build-state risk and make release outputs independently verifiable.

## Scope
Build inputs, environment, timestamps, generated files, dependency resolution, and artifact creation.

## MUST
- Release builds MUST control inputs that materially affect artifact content.
- Differences between nominally identical builds MUST be investigated when reproducibility is a stated assurance requirement.
- Build metadata that intentionally varies MUST be documented and separated from security-relevant content where practical.
- Reproduction procedures MUST identify source revision, toolchain, dependency state, and required environment.
- Deterministic dependency resolution MUST be used where the ecosystem supports it.

## MUST NOT
- MUST NOT rely on undeclared developer-local files or ambient environment state for release output.
- MUST NOT claim reproducibility without comparing independently produced outputs or normalized equivalents.
- MUST NOT ignore unexplained binary differences in high-assurance releases.

## SHOULD
- Critical artifacts SHOULD support reproducible or independently verifiable builds.
- Build environments SHOULD minimize nondeterministic inputs.

## Exceptions
Exceptions require documented nondeterminism, impact analysis, accepted verification alternative, owner, and review date.

## Verification
Rebuild from clean environments, compare artifact digests or normalized outputs, inspect declared inputs, and review dependency lock state.