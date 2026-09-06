# Privacy and Compliance Rules

## Purpose
Prevent model-registry metadata and artifacts from violating privacy, contractual, regulatory, or data-handling obligations.

## Scope
Model artifacts, embedded data, metadata, lineage, retention, access, export, and compliance evidence.

## MUST
- Models subject to privacy or regulatory controls MUST record the applicable classification and handling requirements.
- Registry processes MUST avoid storing raw sensitive training data inside metadata unless explicitly required and authorized.
- Retention and deletion behavior MUST respect legal holds, contractual obligations, and documented lifecycle requirements.
- Export or replication of governed artifacts MUST preserve required access and residency controls.
- Compliance claims MUST link to review evidence rather than rely on labels alone.

## MUST NOT
- MUST NOT assume a model artifact is free of sensitive information without assessment where memorization or embedded data is plausible.
- MUST NOT copy governed models to lower-control environments without authorization.
- MUST NOT remove audit or lineage evidence required by active obligations.

## SHOULD
- Minimize sensitive metadata and use references to protected evidence stores.
- Periodically review classifications as model use changes.

## Exceptions
Exceptions require documented obligation, risk review, safeguards, and approval.

## Verification
Inspect classifications, access policies, retention settings, export controls, and linked compliance evidence.