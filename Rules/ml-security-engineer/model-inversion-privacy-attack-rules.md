# Model Inversion and Privacy Attack Rules

## Purpose
Limit disclosure of sensitive training information through inference behavior.

## Scope
Applies to membership inference, model inversion, attribute inference, memorization, and related privacy attacks.

## MUST
- Assess privacy-attack risk when training data contains personal, confidential, or regulated information.
- Test representative attack classes before release when exposure and data sensitivity justify it.
- Treat confidence scores, embeddings, gradients, and intermediate outputs as potential disclosure channels.
- Escalate evidence of recoverable sensitive training data before deployment or continued operation.

## MUST NOT
- Claim privacy protection solely because raw training data is not directly exposed.
- Publish sensitive model outputs or embeddings without evaluating inference risk.
- Suppress a confirmed privacy finding to preserve a release date.

## SHOULD
- Minimize unnecessary output precision and retained sensitive features.
- Consider privacy-preserving training or aggregation when measurable risk remains high.

## Exceptions
Accepted residual privacy risk requires documented attack evidence, impact analysis, legal or privacy review where relevant, and explicit approval.

## Verification
Review attack evaluations, memorization tests, output contracts, privacy assessments, and release approvals.