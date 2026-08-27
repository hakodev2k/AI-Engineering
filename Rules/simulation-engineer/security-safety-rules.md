# Security and Safety Rules
## Purpose
Prevent simulation systems and outputs from creating avoidable security or safety risk.
## Scope
Inputs, code, dependencies, execution environments, artifacts, and sensitive models.
## MUST
- Validate untrusted inputs and isolate execution appropriate to their risk.
- Protect secrets, sensitive datasets, proprietary models, and controlled outputs by least privilege.
- Threat-model externally exposed simulation services and artifact pipelines.
## MUST NOT
- execute untrusted model plugins or scripts with unrestricted production credentials.
- weaken security controls solely to unblock a run.
## SHOULD
- Scan dependencies and artifacts and use reproducible trusted build inputs.
## Exceptions
Security-control exceptions require documented risk, compensating controls, expiry, and human approval.
## Verification
Security scans, access review, configuration inspection, dependency reports, and threat-model review.