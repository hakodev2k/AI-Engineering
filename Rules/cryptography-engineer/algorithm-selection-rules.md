# Algorithm Selection Rules

## Purpose
Prevent weak, obsolete, or context-inappropriate algorithm choices.

## Scope
Symmetric encryption, signatures, hashes, MACs, KDFs, and key agreement.

## MUST
- Select algorithms from current approved standards and project security policy.
- Match algorithm, mode, parameter sizes, and security level to the threat model and required lifetime.
- Document interoperability and migration constraints for externally visible choices.

## MUST NOT
- Introduce deprecated algorithms, insecure modes, truncated outputs, or nonstandard parameters without explicit security approval.
- Choose algorithms solely for implementation convenience or benchmark speed.

## SHOULD
- Prefer widely deployed algorithms with mature, maintained implementations and practical migration paths.

## Exceptions
Require documented necessity, bounded exposure, compensating controls, sunset date, and approval.

## Verification
Inspect configuration and code; run policy/static checks; verify parameters against current organizational and standards guidance.