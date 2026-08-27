# Digital Signature Rules

## Purpose
Preserve authenticity and integrity claims made through digital signatures.

## Scope
Code, documents, tokens, protocol messages, artifacts, and certificates.

## MUST
- Define exactly what bytes and context are signed and verified.
- Verify signer identity, algorithm policy, key status, and domain context before accepting a signature.
- Domain-separate signatures used for materially different protocols or object types.

## MUST NOT
- Treat signature validity alone as authorization.
- Accept ambiguous serialization or unsigned security-relevant fields.
- Ignore verification failures or unsupported algorithms.

## SHOULD
- Use canonical encodings or otherwise unambiguous signed representations.

## Exceptions
Compatibility deviations require ambiguity analysis, bounded scope, tests, migration plan, and approval.

## Verification
Use positive/negative test vectors, altered-field tests, cross-protocol tests, key-status checks, and code review.