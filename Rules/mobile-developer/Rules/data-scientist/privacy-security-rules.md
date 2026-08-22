# Privacy and Security Rules
## Purpose
Protect sensitive data throughout analytical work.
## Scope
Collection, access, notebooks, exports, models, logs, and sharing.
## MUST
- Use only authorized data for an approved purpose and apply least-privilege access.
- Minimize sensitive fields and protect them in storage, transit, exports, and logs.
- Assess re-identification and model memorization risks when relevant.
## MUST NOT
- Copy production secrets or sensitive records into source control, prompts, public tools, or unmanaged devices.
- Weaken access controls to accelerate analysis.
## SHOULD
- Prefer de-identified or aggregated datasets when they satisfy the objective.
## Exceptions
Elevated access requires purpose, duration, controls, and human approval.
## Verification
Inspect permissions, data classifications, repository scans, logs, exports, retention, and access audit evidence.