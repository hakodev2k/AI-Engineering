# Skill: Dependency Upgrade Analysis

## Purpose
Build an evidence-backed upgrade plan before dependency files are edited.

## When to use
Use for any dependency upgrade that can affect runtime behavior, contracts, transitive packages, generated code, security, database behavior, build tooling, or deployment.

## Inputs
- requested dependency and target version;
- repository dependency files;
- current direct/transitive dependency state;
- release notes, migration guides, advisories, and compatibility documentation;
- relevant tests and runtime configuration.

## Preconditions
- repository state can be inspected;
- current dependency version is known;
- target version is explicit;
- destructive or production actions are not required to perform analysis.

## Process
1. Locate every direct declaration of the dependency.
2. Identify all projects/apps/packages that consume it.
3. Capture the current direct version and relevant transitive versions.
4. Identify the target version and version-gap magnitude.
5. Gather authoritative breaking-change and migration evidence.
6. Classify changes into: compile-time API, runtime behavior, configuration/defaults, serialization/contracts, database/persistence, security/auth, performance/resource usage, build/tooling, generated code, deployment/runtime prerequisites.
7. Search the repository for usage of affected APIs, options, extension methods, configuration keys, serializers, providers, generated artifacts, and package-specific conventions.
8. Map each upstream change to repository evidence: file, symbol/config path, affected behavior, confidence.
9. Identify tests that currently protect each affected behavior.
10. Identify missing tests or runtime checks.
11. Enumerate direct and expected transitive dependency changes.
12. Define rollback: exact previous dependency state and any non-reversible migration risk.
13. Mark approval requirements.
14. Write `upgrade-manifest.json` using the provided schema.
15. Stop before implementation if any high-risk unknown remains unresolved.

## Tools it may use
Repository search/read tools, Git, package-manager inspection commands, official documentation/release notes, build metadata readers, test discovery.

## Constraints
- Prefer authoritative upstream sources over secondary summaries.
- Do not infer compatibility from version numbering alone.
- Do not edit dependency files during analysis.
- Do not treat successful compilation as proof of runtime compatibility.
- Do not silently combine unrelated refactors with the upgrade.

## Expected output
A complete `upgrade-manifest.json` containing dependency delta, affected surfaces, evidence, tests, approvals, rollback plan, and unresolved risks.

## Verification
Confirm every high/critical upstream change has either a repository impact record or explicit evidence that it is not applicable.

## Failure handling
Retry repository discovery once with alternative search terms. Retry transient documentation/package-registry access at most twice. If authoritative evidence remains unavailable for a high-risk upgrade, stop and escalate.

## Stop conditions
Stop when the target version is ambiguous, a required breaking change lacks evidence, rollback is unsafe, or required human approval has not been granted.
