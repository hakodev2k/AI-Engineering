# Record Integrity Rules

## Purpose
Prevent semantically invalid or dangerous DNS record configurations.

## Scope
A, AAAA, CNAME, MX, TXT, SRV, CAA, PTR, NS, and related records.

## MUST
- Record changes MUST be checked for protocol constraints and conflicting record semantics.
- Mail, certificate, service-discovery, and reverse-DNS records MUST be validated against their consuming systems when material.
- Wildcards MUST have documented intent and impact analysis.

## MUST NOT
- MUST NOT publish record combinations known to violate DNS semantics.
- MUST NOT use wildcard records as a substitute for understood naming requirements without review.

## SHOULD
- Records SHOULD have documented ownership where operational impact is significant.

## Exceptions
Nonstandard use requires consumer evidence, compatibility testing, and approval.

## Verification
Lint zone data, query authoritative answers, test consumer behavior, and review conflicting/wildcard records.