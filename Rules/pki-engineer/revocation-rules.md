# Certificate Revocation

## Purpose
Ensure compromised or no-longer-authorized certificates are invalidated promptly and consistently.

## Scope
Applies to revocation reasons, authorization, propagation, and emergency revocation.

## MUST
- Revocation requests MUST authenticate the requester or incident authority and record an appropriate reason.
- Compromise-driven revocation MUST be treated as time-sensitive and propagated through configured status mechanisms.
- Revocation authority and emergency procedures MUST be documented and tested.
- Dependent credentials or certificates MUST be assessed when shared key material or issuer compromise is suspected.

## MUST NOT
- MUST NOT delay revocation solely to avoid service disruption when unauthorized key use is credible.
- MUST NOT revoke without preserving enough evidence for audit and incident analysis.
- MUST NOT assume deleting a certificate from a server revokes it for relying parties.

## SHOULD
- Automate revocation for authoritative deprovisioning events where identity binding is reliable.

## Exceptions
Require documented risk decision, temporary mitigation, owner, and explicit deadline.

## Verification
Inspect revocation logs, CA database, CRL/OCSP state, incident records, timestamps, and relying-party behavior tests.