# ConfigCat workflow examples

Read inventory: call `configcat.product.list`, then `configcat.config.list` and `configcat.flag.list`. These are READ operations and require no approval.

Inspect rollout: call `configcat.environment.list`, then `configcat.flag.value.get` with the environment and setting UUIDs. Expected output wraps provider JSON in `untrustedProviderData` plus rate-limit metadata.

Change a flag: first read its current value, prepare a minimal JSON Patch such as `[{"op":"replace","path":"/value","value":true}]`, then call `configcat.flag.value.update`. This is HIGH_RISK because changing a feature flag can alter production behavior. It requires `CONFIGCAT_ALLOW_HIGH_RISK=true` and `{ "approval": { "confirmed": true, "reason": "Human reviewed this exact rollout" } }`.
