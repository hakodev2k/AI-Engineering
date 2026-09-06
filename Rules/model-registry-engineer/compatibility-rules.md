# Model Compatibility Rules

## Purpose
Prevent deployment failures caused by incompatible model interfaces, runtimes, preprocessing, or serving assumptions.

## Scope
Input/output schemas, preprocessing, tokenizers, feature contracts, runtimes, accelerators, serialization, and serving APIs.

## MUST
- Production-candidate models MUST declare required input/output contracts and runtime compatibility.
- Compatibility checks MUST run against the target serving stack before promotion.
- Changes to preprocessing, tokenizer, feature ordering, or output semantics MUST be treated as contract changes.
- Consumers MUST be able to determine whether a model version is compatible before deployment.

## MUST NOT
- MUST NOT assume compatibility because two artifacts use the same framework.
- MUST NOT deploy a model whose required runtime or preprocessing assets are unavailable.
- MUST NOT change serving semantics under an existing compatibility identifier.

## SHOULD
- Maintain contract tests between registry artifacts and serving adapters.
- Prefer explicit compatibility matrices for multiple runtimes.

## Exceptions
Exceptions require documented incompatibility, mitigation, rollback plan, and approval.

## Verification
Run interface tests, environment checks, sample inference, and serving-adapter compatibility tests.