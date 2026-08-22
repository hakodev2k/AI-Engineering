# Golden Path Rules

## Purpose
Provide supported implementation paths that reduce cognitive load while preserving engineering flexibility.

## Scope
Applies to templates, service scaffolds, deployment patterns, observability defaults, runtime baselines, and platform recommendations.

## MUST
- Golden paths MUST encode current security, reliability, and operability requirements.
- Each path MUST declare supported use cases, constraints, ownership, and upgrade expectations.
- Breaking path changes MUST include migration guidance.
- Defaults MUST be production-safe for intended workloads.

## MUST NOT
- MUST NOT force teams onto a path that violates documented workload requirements.
- MUST NOT leave generated projects dependent on abandoned or unowned components.
- MUST NOT present experimental patterns as standard without clear labeling.

## SHOULD
- Prefer composable paths over monolithic templates.
- Measure adoption and failure reasons before expanding platform scope.

## Exceptions
Departures require documented workload needs, risks, alternative controls, and review where platform guarantees are affected.

## Verification
Inspect templates, generated output, dependency freshness, security checks, integration tests, documentation, and adoption telemetry.