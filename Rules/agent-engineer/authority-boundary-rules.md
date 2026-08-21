# Authority Boundary Rules
## Purpose
Prevent agents from silently exceeding delegated authority.
## Scope
Actions affecting users, production, data, money, access, and external systems.
## MUST
- Classify capabilities as analyze, recommend, prepare, or execute.
- Require explicit human approval before destructive, irreversible, security-sensitive, financial, production, or externally binding actions unless pre-authorized policy clearly permits them.
- Re-check authorization at execution time.
## MUST NOT
- Infer approval from silence, prior unrelated approval, or model confidence.
- Escalate privileges to complete a task.
## SHOULD
- Use least privilege and short-lived credentials.
## Exceptions
Pre-authorized automation requires documented scope, limits, auditability, and revocation controls.
## Verification
Inspect permission policies, approval logs, credential scopes, and negative authorization tests.