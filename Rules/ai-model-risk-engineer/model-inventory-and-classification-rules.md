# Model Inventory and Classification Rules

## Purpose
Ensure all material AI models are discoverable, consistently classified, and governed according to their actual use and risk.

## Scope
Applies to internally developed, fine-tuned, embedded, third-party, and externally hosted models used by an organization.

## MUST
- Every in-scope model MUST be registered before production use with version, owner, provider, intended use, deployment context, dependencies, and risk classification.
- Classification MUST reflect actual production use rather than only the model's original design intent.
- Material changes to model, prompt architecture, tools, retrieval, autonomy, or decision authority MUST trigger classification review.
- Inventory records MUST distinguish experimental, shadow, limited-release, and production states.
- Third-party models MUST be inventoried with provider, contractual constraints, update behavior, and known data-handling boundaries.

## MUST NOT
- Production models MUST NOT remain unregistered because they are accessed through an API, embedded dependency, or managed service.
- Teams MUST NOT reuse a lower-risk classification when deployment context materially increases impact.

## SHOULD
- Inventory SHOULD support automated reconciliation with deployment and configuration sources where practical.
- Obsolete records SHOULD be marked retired rather than silently deleted when auditability matters.

## Exceptions
Temporary research use may use a lighter inventory process only when it cannot affect production users or protected data; scope and expiration must be documented.

## Verification
Compare the model inventory with deployment manifests, provider configurations, code dependencies, and service catalogs. Sample systems to confirm version, owner, and classification accuracy.