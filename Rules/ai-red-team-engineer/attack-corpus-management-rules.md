# Attack Corpus Management

## Purpose
Maintain adversarial test assets without contaminating evaluation quality or exposing dangerous material unnecessarily.

## Scope
Prompts, payloads, conversations, documents, media, scripts, labels, metadata, and benchmark splits.

## MUST
- Version attack corpora and record provenance, intended threat class, expected behavior, and sensitivity.
- Separate development attacks from held-out evaluation sets when measuring robustness.
- Restrict sensitive attack material to authorized users.

## MUST NOT
- Mix leaked evaluation cases into training or tuning data without tracking contamination.
- Store credentials, personal data, or live exploit material when safe substitutes suffice.

## SHOULD
Deduplicate semantically similar attacks and track coverage by attack family and system surface.

## Exceptions
Sensitive artifacts require documented necessity, access controls, retention, and disposal requirements.

## Verification
Inspect repository history, access policy, corpus metadata, split integrity, and contamination checks.