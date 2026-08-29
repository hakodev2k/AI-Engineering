# Fine-Tuning Security Rules

## Purpose
Prevent fine-tuning, adapter training, and customization workflows from introducing poisoned behavior, sensitive-data leakage, backdoors, or regressions in security controls.

## Scope
Applies to supervised fine-tuning, preference tuning, adapters, LoRA-style customization, continued pretraining, and any process that produces modified model behavior from project or customer data.

## MUST
- Fine-tuning data MUST have documented provenance, authorization, intended use, and sensitivity classification before training begins.
- Customer or tenant tuning datasets, checkpoints, and adapters MUST be isolated according to their authorization boundaries.
- Fine-tuned models MUST receive security and safety regression evaluation before production promotion.
- Training runs MUST preserve lineage linking source data versions, preprocessing, training configuration, base model, resulting artifact, evaluation evidence, and approval.
- Training jobs MUST use credentials, network access, storage permissions, and compute privileges limited to what the job requires.
- High-risk tuning datasets MUST be assessed for poisoning, malicious instructions, memorization risk, and backdoor indicators appropriate to the threat model.

## MUST NOT
- MUST NOT fine-tune on secrets, credentials, private keys, or unauthorized sensitive data.
- MUST NOT assume security behavior of the base model remains unchanged after customization.
- MUST NOT merge or deploy an unreviewed adapter or checkpoint into a production model.
- MUST NOT mix tenant-specific training artifacts unless the product explicitly authorizes the resulting shared behavior and data use.

## SHOULD
- Training pipelines SHOULD be reproducible and deterministic enough to investigate material regressions.
- Security evaluations SHOULD compare the customized model against the approved base-model baseline.

## Exceptions
Exceptions require documented purpose, data basis, threat analysis, residual risk, compensating controls, verification evidence, and accountable approval.

## Verification
Inspect dataset lineage, training manifests, IAM, storage isolation, artifact hashes, security evaluations, memorization or poisoning tests, promotion records, and approval evidence.