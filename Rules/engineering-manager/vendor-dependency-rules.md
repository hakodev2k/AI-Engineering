# Vendor and Dependency Rules
## Purpose
Control operational, security, financial, and lock-in risks from external technology.
## Scope
SaaS, cloud services, libraries, platforms, and strategic vendors.
## MUST
- Assess material dependencies for security, reliability, data handling, support, cost, and exit risk.
- Define ownership for critical vendor relationships and dependency upgrades.
- Plan alternatives or recovery for dependencies whose failure would cause unacceptable impact.
## MUST NOT
- Introduce critical external services without understanding data and operational consequences.
- Ignore unsupported or materially vulnerable dependencies.
## SHOULD
- Avoid unnecessary coupling to proprietary capabilities when portability has meaningful value.
## Exceptions
Accepted lock-in requires documented benefit, risk, and approval.
## Verification
Review dependency inventories, contracts, security assessments, upgrade status, and continuity plans.