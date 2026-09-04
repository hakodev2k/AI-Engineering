# AI and Machine Learning Privacy Rules

## Purpose
Control privacy risks created by training data, embeddings, model inputs, outputs, memorization, inference, and AI service providers.

## Scope
Applies to machine-learning pipelines, generative AI, embeddings, vector stores, fine-tuning, evaluation datasets, agents, and external model APIs.

## MUST
- Personal data used for training, tuning, retrieval, evaluation, or inference MUST have an approved purpose and handling basis.
- Model-provider data usage, retention, logging, and training settings MUST be verified before sensitive production data is sent externally.
- Retrieval and model outputs MUST enforce the requesting user's authorization boundaries.
- High-risk models MUST be evaluated for memorization, unintended disclosure, inference, and re-identification risks relevant to the use case.
- Embeddings and derived representations MUST be classified according to the information they can reveal or link.

## MUST NOT
- Prompts, model inputs, or evaluation artifacts containing sensitive data MUST NOT be assumed ephemeral without evidence.
- A model MUST NOT be treated as a privacy boundary or authorization mechanism.
- Production personal data MUST NOT be copied into ad hoc training or evaluation sets without approved controls.

## SHOULD
- Privacy-preserving or synthetic datasets SHOULD be preferred when they provide adequate utility.
- Model and retrieval systems SHOULD support data removal or compensating controls when subject deletion affects indexed or training-related artifacts.

## Exceptions
Exceptions require documented purpose, data scope, provider behavior, residual risk, controls, and accountable approval.

## Verification
Inspect model-provider settings, data-flow traces, evaluation datasets, vector stores, authorization tests, memorization tests, retention behavior, and deletion procedures.