# Sender Identity Rules

## Purpose
Protect sender reputation by making every production mail stream attributable to an intentional, governed identity.

## Scope
Domains, subdomains, envelope senders, From identities, return paths, IP pools, and provider accounts used for application, transactional, lifecycle, or bulk email.

## MUST
- Every production stream MUST have an explicit owner, purpose, audience, sending domain, and reputation boundary.
- Transactional and promotional traffic MUST be separable when their risk, consent basis, or volume profile differs.
- New sender identities MUST be inventoried before traffic is enabled.
- Domain alignment decisions MUST account for SPF, DKIM, DMARC, bounce handling, and organizational-domain reputation.
- Shared infrastructure MUST have documented blast-radius and tenant-isolation controls.

## MUST NOT
- MUST NOT send production mail from an unowned, temporary, or undocumented domain.
- MUST NOT move abusive or degraded traffic to a fresh identity merely to evade reputation consequences.
- MUST NOT mix unrelated high-risk traffic into a healthy stream without reviewed evidence that isolation is unnecessary.

## SHOULD
- Use stable, purpose-specific subdomains where isolation improves diagnosis and reputation control.
- Keep identity topology simple enough for operators to reason about during incidents.

## Exceptions
Exceptions require documented reason, affected streams, reputation risk, compensating controls, verification plan, and accountable approval.

## Verification
Review DNS, provider configuration, sender inventory, traffic samples, ownership records, and reputation dashboards. Confirm each observed sender maps to an approved identity and stream.