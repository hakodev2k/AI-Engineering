# Dependency and Versioning

## Purpose
Control search-engine, client, plugin, model, and library changes that can alter behavior or operational risk.

## Scope
Search engines, SDKs, analyzers, plugins, embedding/reranking models, and runtime dependencies.

## MUST
- Pin or constrain production-critical dependency versions according to project policy.
- Review release notes and compatibility for engine, plugin, analyzer, and model upgrades.
- Test rolling-upgrade and mixed-version behavior when the platform can enter that state.
- Maintain an inventory of behavior-affecting search components and versions.

## MUST NOT
- perform large dependency migrations in production without explicit approval and rollback planning.
- assume a minor version cannot change ranking, analysis, resource use, or wire behavior.
- use unsupported plugins or models without ownership and lifecycle plans.

## SHOULD
- Upgrade in small, observable steps.
- Automate vulnerability and end-of-support detection.

## Exceptions
Urgent security upgrades may compress normal evaluation but require documented risk, approval, monitoring, and follow-up validation.

## Verification
Inspect lockfiles/configuration, compatibility matrices, staging results, vulnerability reports, and rollout evidence.