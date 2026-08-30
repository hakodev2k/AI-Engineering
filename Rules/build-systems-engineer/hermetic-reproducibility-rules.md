# Hermetic Reproducibility Rules

## Purpose
Ensure identical declared inputs produce equivalent outputs independent of execution machine, order, or ambient environment.

## Scope
Applies to local builds, CI, remote execution, generated code, packaging, and build-time tooling.

## MUST
- Build actions MUST declare the files, tools, configuration, environment values, and external inputs required for execution.
- Tool versions MUST be pinned or resolved through a controlled versioning mechanism.
- Reproducibility-sensitive actions MUST normalize timestamps, ordering, locale, timezone, and similar nondeterministic metadata where feasible.
- Clean builds MUST be periodically compared across independent workers or environments.
- Any intentional non-hermetic action MUST be isolated and documented.

## MUST NOT
- MUST NOT rely on undeclared machine-local files or globally installed tools.
- MUST NOT consume mutable external content during a reproducible build without an immutable version or digest.
- MUST NOT include current time or uncontrolled random values in artifact content unless explicitly required.

## SHOULD
- Build sandboxes SHOULD restrict access to undeclared filesystem and environment inputs.
- Reproducibility tests SHOULD compare cryptographic digests for artifacts expected to be identical.

## Exceptions
Exceptions MUST state the nondeterministic input, reason, affected artifacts, containment strategy, and reviewer approval.

## Verification
Run clean builds in isolated environments, compare outputs and digests, inspect sandbox violations, and validate that required environment values and tools are explicitly declared.