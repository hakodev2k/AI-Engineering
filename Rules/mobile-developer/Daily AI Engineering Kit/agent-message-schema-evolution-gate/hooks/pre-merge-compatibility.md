# Hook: Pre-Merge Message Compatibility

## Trigger
Before merging a change that modifies a serialized message/event contract or its serializer configuration.

## Preconditions
Old and proposed schemas are available as JSON Schema, or equivalent project-specific checks have been configured. Producer and at least one consumer are identified.

## Action
Run the deterministic checker, then project tests and independent verification:

```text
python scripts/check-message-schema.py --old <old.schema.json> --new <new.schema.json> --message <message> --producer <producer> --consumer <consumer> --output compatibility-report.json
python tests/test-check-message-schema.py
python scripts/verify-package.py
```

For multiple consumers repeat `--consumer`.

## Expected result
- Checker exits 0 for statically compatible changes; exit 1 for detected breaking changes; exit 2 for invalid input/tool errors.
- Fixture tests pass.
- Package verification passes.
- Behavioral/cross-version consumer tests required by the workflow also pass.

## Failure behavior
A breaking result blocks merge unless the design is changed to a compatible/versioned rollout and independently verified. Transient tooling failure may be retried at most 2 times. Permission or deterministic validation failures are not bypassed.

## Blocking
Yes. This hook is a gate, not an auto-fixer. It must not mutate production brokers, schema registries, topics, subscriptions, stored messages, or permissions.
