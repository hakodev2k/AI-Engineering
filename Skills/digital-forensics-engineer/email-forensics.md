# Email Forensics

## Purpose
Analyze email evidence to reconstruct message origin, delivery path, account activity, phishing, impersonation, and mailbox manipulation.

## When to use
Use for business email compromise, phishing, suspicious forwarding, mailbox rule abuse, spoofing, or message-attribution questions.

## Inputs
Raw messages, headers, mailbox audit logs, provider logs, attachments, URLs, identities, and incident window.

## Context to inspect
Authentication results, message trace, DKIM/SPF/DMARC, received headers, mailbox rules, OAuth grants, delegated access, login telemetry, and retention.

## Core knowledge
Displayed sender names are untrusted. Header chains, provider audit records, authentication results, and account activity must be interpreted together. Forwarding and gateways can legitimately alter headers.

## Procedure
1. Preserve raw messages and calculate hashes.
2. Parse routing headers from trusted boundaries outward.
3. Evaluate SPF, DKIM, DMARC, and provider authentication results.
4. Review message trace and mailbox audit events.
5. Inspect rules, forwarding, delegates, OAuth applications, and sign-ins.
6. Analyze URLs and attachments in a controlled environment when authorized.
7. Correlate message timing with identity and endpoint evidence.
8. Separate spoofing, account compromise, and legitimate forwarding hypotheses.

## Decision points
Prioritize provider-side logs over screenshots. Treat failed authentication as suspicious context, not proof of maliciousness.

## Common failure patterns
Trusting visible From fields, analyzing rendered messages instead of raw source, ignoring mailbox rules, and confusing relays with origin systems.

## Verification
Confirm key claims through raw headers plus independent provider or identity evidence.

## Expected output
Message provenance, account-activity findings, phishing indicators, and confidence-qualified conclusions.

## Stop conditions
Stop when only screenshots exist for a claim requiring raw metadata, or accessing mailbox content exceeds authorization.