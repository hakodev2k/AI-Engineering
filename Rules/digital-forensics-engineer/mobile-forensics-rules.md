# Mobile Forensics Rules

## Purpose
Acquire and analyze mobile evidence while controlling device-state, encryption, synchronization, and privacy risks.

## Scope
Applies to phones, tablets, backups, synchronized cloud data, SIM/eSIM context, and application artifacts.

## MUST
- Device state, lock state, connectivity, power, identifiers, and collection method MUST be documented.
- Isolation decisions MUST consider remote wipe risk, network evidence, and operational consequences.
- Logical, filesystem, backup, and physical acquisitions MUST be labeled accurately.
- Application artifacts MUST be interpreted against app/version/platform behavior.
- Private data outside authorized scope MUST be minimized and access-controlled.

## MUST NOT
- MUST NOT unlock, bypass protections, or access linked accounts beyond granted authority.
- MUST NOT assume deleted or absent app data was user-deleted without corroboration.
- MUST NOT merge device and cloud evidence without separate provenance.

## SHOULD
- Preserve device photographs and state before interaction.
- Correlate device, backup, cloud, carrier, and application evidence when authorized.

## Exceptions
Urgent preservation actions require documented necessity, expected device changes, authority, and resulting limitations.

## Verification
Review acquisition reports, device identifiers, app versions, hashes, state photographs, extraction type, and cross-source correlation.