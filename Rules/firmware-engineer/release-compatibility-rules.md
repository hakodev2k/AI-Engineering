# Release and Compatibility

## Purpose
Ship traceable firmware without accidental incompatibility.

## Scope
Firmware versions, hardware revisions, bootloaders, protocols, stored data, and manufacturing.

## MUST
- Every production image MUST be uniquely traceable to source revision, configuration, toolchain, and target hardware.
- Compatibility matrices MUST cover supported hardware, bootloader, persistent schema, and external protocol dependencies.
- Breaking compatibility changes MUST be explicit, reviewed, and paired with migration or coordinated rollout strategy.
- Release artifacts MUST be immutable after approval; changes require a new identified build.
- Release notes MUST identify material operational, compatibility, and recovery implications.

## MUST NOT
- A binary built for an incompatible hardware revision MUST NOT be installable without an explicit override mechanism and approval.
- Version identifiers MUST NOT be reused for different production binaries.

## SHOULD
- Automated compatibility gates SHOULD prevent known-invalid combinations.

## Exceptions
Compatibility exceptions require documented affected population, migration path, evidence, and approval.

## Verification
Validate artifact hashes, provenance, compatibility tests, upgrade/downgrade paths, and target identifiers.