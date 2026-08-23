# Phishing and Email Response Rules

## Purpose
Investigate malicious email and reduce account and payload compromise risk.

## Scope
Phishing, business email compromise, malicious attachments, links, spoofing, and mailbox abuse.

## MUST
- Investigations MUST identify sender context, recipients, delivery status, link or attachment behavior, and affected identities.
- Confirmed malicious messages MUST be removed or contained across reachable mailboxes where technically and legally permitted.
- Suspected credential theft MUST trigger identity and session investigation, not email-only remediation.
- Blocking indicators MUST consider shared infrastructure and false-positive impact.

## MUST NOT
- MUST NOT assume a reported message is isolated without checking broader delivery or campaign evidence.
- MUST NOT detonate suspicious content outside approved analysis controls.

## SHOULD
- Response SHOULD extract campaign indicators and feed durable detections or awareness improvements.

## Exceptions
Bulk removal deviations require documented operational or legal constraints and compensating controls.

## Verification
Review mail traces, campaign searches, removal actions, identity investigation, detections, and user-impact evidence.