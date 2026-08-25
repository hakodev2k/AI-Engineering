# Crypto Agility and Migration

## Purpose
Design systems that can replace algorithms, parameters, keys, certificates, and formats safely without ambiguous downgrade behavior.

## When to use
Use for long-lived systems, deprecation programs, compliance changes, algorithm transitions, or post-quantum preparation.

## Inputs
Current crypto inventory, data lifetime, protocol peers, persisted formats, dependency support, rollout topology, and deprecation deadlines.

## Context to inspect
Algorithm identifiers, key metadata, ciphertext/signature versions, negotiation, readers/writers, certificates, APIs, stored data, and rollback mechanisms.

## Core knowledge
Crypto agility is controlled versioning and migration, not unrestricted algorithm negotiation. Readers generally need overlap before writers switch. Downgrade resistance and explicit policy are essential.

## Procedure
1. Inventory algorithms, parameters, formats, keys, and dependencies.
2. Classify by exposure, lifetime, and migration urgency.
3. Introduce explicit version/algorithm identifiers where absent.
4. Ensure new readers/verifiers can handle both old and new formats.
5. Deploy support broadly before switching writers/signers.
6. Prevent unauthenticated downgrade negotiation.
7. Migrate stored material incrementally when necessary.
8. Measure remaining legacy usage.
9. Disable old creation first, then old acceptance after evidence.
10. Remove legacy code and document final state.

## Decision points
Use dual-read/single-write for most persisted-format migrations. Dual-signing or hybrid mechanisms may be appropriate during ecosystem transitions but increase complexity and must follow relevant standards.

## Common failure patterns
Hard-coded algorithms; algorithm chosen by untrusted input; big-bang migration; deleting old keys before data migration; indefinite dual support; rollback re-enables weak modes.

## Verification
Track legacy usage to zero, test downgrade attempts, restore old backups, validate mixed-version interoperability, and confirm policy enforcement after retirement.

## Expected output
A staged migration plan with compatibility windows, telemetry, rollback boundaries, and retirement criteria.

## Stop conditions
Stop if persisted data cannot identify its cryptographic format/key or critical peers cannot support a secure transition path.