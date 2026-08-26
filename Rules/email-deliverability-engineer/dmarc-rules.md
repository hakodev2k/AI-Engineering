# DMARC Rules

## Purpose
Use DMARC to enforce aligned authentication, obtain receiver evidence, and reduce domain spoofing risk.

## Scope
DMARC policy, alignment, aggregate reporting, forensic considerations, subdomain policy, and rollout.

## MUST
- Every production organizational domain used in visible From addresses MUST have an intentional DMARC policy.
- Policy changes MUST be based on aggregate evidence showing legitimate sources and alignment status.
- Enforcement rollout MUST account for third-party senders, forwarding behavior, and subdomains.
- Aggregate reports MUST be monitored for unauthorized or newly failing sources.
- Report destinations MUST be controlled and data handling MUST meet privacy requirements.

## MUST NOT
- MUST NOT move directly to strict enforcement when legitimate sending sources are unknown.
- MUST NOT weaken DMARC merely to accommodate an unidentified sender; identify and govern the sender first.
- MUST NOT assume SPF pass implies DMARC pass without alignment.

## SHOULD
- Progress toward enforcement when evidence supports it.
- Use subdomain policy deliberately rather than relying on accidental inheritance.

## Exceptions
Temporary policy relaxation requires evidence, scope, expiry, remediation owner, abuse risk, and approval.

## Verification
Inspect published policy, aggregate reports, raw headers, alignment outcomes, third-party inventory, and policy-change history. Confirm legitimate streams continue to authenticate under the intended policy.