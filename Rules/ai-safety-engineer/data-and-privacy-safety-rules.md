# Data and Privacy Safety Rules

## Purpose
Prevent AI systems from exposing, memorizing, inferring, or misusing sensitive data.

## Scope
Covers training, evaluation, retrieval, prompts, logs, memory, outputs, and tool-accessed data.

## MUST
- Minimize collection, retention, and model exposure to data required for the stated purpose.
- Apply access controls and retention rules to prompts, outputs, traces, and evaluation artifacts.
- Test for sensitive-data leakage where models can access or reproduce protected information.
- Document provenance and permitted use for safety-relevant datasets.

## MUST NOT
- Place credentials, tokens, or unnecessary sensitive records in prompts or evaluation fixtures.
- Use production personal data for testing without approved safeguards.
- Assume model refusal behavior is sufficient privacy protection.

## SHOULD
- Prefer synthetic or de-identified test data where it preserves evaluation validity.
- Separate safety telemetry from user content when practical.

## Exceptions
Sensitive-data use requires documented necessity, legal/policy basis, access controls, retention, risk assessment, and approval.

## Verification
Inspect data flows, permissions, retention configuration, leakage tests, dataset provenance, and deletion behavior.
