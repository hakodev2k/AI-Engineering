# Schema Evolution Rules

## Purpose
Enable independent deployment without corrupting or stranding historical event data.

## Scope
Applies to schema registries, serializers, producers, consumers, replay, and retained events.

## MUST
- Schema evolution MUST follow the stream's declared backward, forward, or full compatibility mode.
- Changes MUST be tested against representative historical payloads and the oldest supported consumer contract.
- Defaults MUST have explicit business meaning; adding a field with a misleading default is a breaking semantic change.
- Enum evolution, numeric widening, logical types, and field renames MUST be assessed according to the actual serialization format.
- Registry compatibility settings MUST be managed as controlled configuration.

## MUST NOT
- MUST NOT disable registry compatibility checks merely to unblock a deployment.
- MUST NOT assume a field rename is compatible because the data type is unchanged.
- MUST NOT delete schemas required to deserialize retained or archived events.
- MUST NOT introduce incompatible changes in place when a parallel versioned contract is required.

## SHOULD
- Evolution SHOULD favor additive changes.
- Consumers SHOULD tolerate unknown fields where the serialization technology supports it.
- Migration plans SHOULD define the point at which old schema versions can safely retire.

## Exceptions
A compatibility exception requires impact analysis, retained-data analysis, migration and rollback plans, affected-owner approval, and validation in a production-like environment.

## Verification
Run registry compatibility validation, historical-fixture tests, producer/consumer contract tests, replay tests, and configuration inspection before release.