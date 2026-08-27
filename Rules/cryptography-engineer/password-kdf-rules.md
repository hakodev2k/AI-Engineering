# Password and KDF Rules

## Purpose
Protect password-derived secrets and cryptographic key derivation.

## Scope
Password hashing, password-based encryption, KDFs, salts, context labels, and derived keys.

## MUST
- Use an approved password-hashing construction with unique salts and parameters calibrated to the deployment threat and resource budget.
- Use purpose-specific KDFs for deriving cryptographic subkeys.
- Domain-separate derived keys by purpose and protocol context.

## MUST NOT
- Store reversible password representations or fast unsalted password hashes.
- Reuse one derived key for incompatible cryptographic purposes.
- Hard-code KDF parameters without a documented upgrade path.

## SHOULD
- Rehash credentials when successful authentication reveals obsolete parameters.

## Exceptions
Legacy verification requires migration controls, no new legacy hashes, bounded duration, and approval.

## Verification
Inspect stored formats, KDF parameters, migration tests, performance measurements, and key-separation tests.