# Cryptographic Key Rules

## Purpose
Protect cryptographic keys according to their function, sensitivity, and cryptoperiod.

## Scope
Encryption, signing, wrapping, root, intermediate, and application cryptographic keys under secrets-management ownership.

## MUST
- Key purpose, algorithm, strength, owner, cryptoperiod, exportability, and allowed operations MUST be defined.
- High-impact private or root key material MUST use hardware-backed or equivalently strong protection where required by risk or policy.
- Key usage MUST be separated by purpose so compromise of one function does not unnecessarily affect another.
- Key replacement and retirement MUST preserve required decryption or verification capability without extending unauthorized use.

## MUST NOT
- Private keys MUST NOT be distributed when remote cryptographic operations can meet the requirement safely.
- Keys MUST NOT be reused across unrelated environments or security purposes without explicit design justification.
- Deprecated algorithms MUST NOT be introduced for new protection absent approved compatibility need.

## SHOULD
- Prefer non-exportable keys and managed rotation.
- Maintain crypto-agility for significant long-lived systems.

## Exceptions
Exceptions require cryptographic review, compatibility evidence, risk, migration plan, and security approval.

## Verification
Inspect key policies, algorithms, HSM/KMS settings, usage logs, export controls, rotation history, and retirement tests.