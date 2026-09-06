# Privacy and Consent Rules

## Purpose
Ensure persistent memory respects privacy, consent, purpose limitation, and deletion obligations.

## Scope
Personal data, user preferences, sensitive attributes, consent, retention, export, and deletion.

## MUST
- Personal memory MUST have a documented purpose and lawful or policy-approved basis for retention where required.
- User-controlled memory MUST support deletion or correction when product requirements provide those rights.
- Sensitive memory categories MUST receive stricter access, retention, and validation controls.
- Downstream indexes and caches MUST honor deletion and revocation within defined service objectives.

## MUST NOT
- MUST NOT persist sensitive attributes merely because they appeared in conversation.
- MUST NOT infer consent from unrelated user activity.
- MUST NOT retain deleted memory in active retrieval indexes beyond approved technical windows.

## SHOULD
- Minimize stored personal detail to what the use case actually requires.
- Make memory use transparent where product policy requires it.

## Exceptions
Exceptions require privacy review, documented purpose, safeguards, and approval.

## Verification
Review data classification, consent flow, deletion tests, retention policy, and index purge evidence.