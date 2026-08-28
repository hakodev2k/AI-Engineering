# Reproducible Build Rules

## Purpose
Ensure identical declared inputs produce equivalent artifacts suitable for verification, release provenance, and incident investigation.

## Scope
Applies to compilation, linking, archive creation, packaging, generated metadata, timestamps, ordering, and release artifact production.

## MUST
- Release builds MUST minimize nondeterministic metadata such as timestamps, random ordering, and machine-specific paths.
- Reproducibility claims MUST be supported by repeated builds from the same revision in independent clean environments.
- Differences between supposedly equivalent build outputs MUST be investigated before release when they affect executable or package content.
- Generated manifests and archives MUST use stable ordering where format semantics permit it.

## MUST NOT
- MUST NOT claim reproducibility based only on one successful build.
- MUST NOT ignore unexplained binary differences in release-critical artifacts.
- MUST NOT embed secrets or unnecessary workstation identifiers into produced artifacts.

## SHOULD
- Artifact comparison SHOULD distinguish expected metadata variation from substantive content differences.
- Build pipelines SHOULD retain enough provenance to recreate the producing environment.

## Exceptions
Exceptions require a documented nondeterministic source, risk assessment, evidence that security and functionality are unaffected, and approval for release-critical artifacts.

## Verification
Rebuild from the same commit in separate clean workers, compare digests and structural diffs, and review provenance records.