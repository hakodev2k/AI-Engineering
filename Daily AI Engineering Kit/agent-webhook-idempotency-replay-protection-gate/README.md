# Agent Webhook Idempotency and Replay Protection Policy

A focused policy package for validating baseline webhook authenticity, freshness, replay, and idempotency settings before they are integrated into a provider-specific handler.

## Scope

This package validates the structure and internal consistency of `config/policy.yaml`. It does not verify provider signatures, persist idempotency claims, or execute business side effects. For a complete reference gate with atomic SQLite claims, tests, workflow, and integration guidance, use the sibling [Agent Webhook Replay Idempotency Gate](../agent-webhook-replay-idempotency-gate/).

## Package contents

```text
agent-webhook-idempotency-replay-protection-gate/
├── README.md
├── config/policy.yaml
├── schemas/policy.schema.json
├── scripts/validate_policy.py
└── tests/test_validate_policy.py
```

## Prerequisites and installation

- Python 3.10 or newer.
- PyYAML 6.x, available through the collection-level `requirements.txt`.

From the parent collection directory:

```bash
python -m pip install -r requirements.txt
```

## Configuration contract

- `max_clock_skew_seconds` is the tolerated difference between sender and receiver clocks.
- `replay_window_seconds` is the maximum accepted event age.
- `idempotency_ttl_seconds` is how long a processed event identity must remain protected and must not be shorter than the replay window.
- `require_signature`, `require_timestamp`, and `require_event_id` should remain enabled outside an explicitly isolated development fixture.
- `allow_unsigned_in_development` must never be interpreted as permission to accept unsigned production traffic.
- Header names must be non-empty HTTP header tokens.
- `secret_env_var` names the environment variable containing the shared secret; the secret itself must never appear in this file.

Provider-specific cryptography can require a different algorithm or canonicalization process. Do not change `hash_algorithm` without matching the provider's official signature contract and adding deterministic signature fixtures.

## Validate

Run from this package directory:

```bash
python scripts/validate_policy.py config/policy.yaml
python -m unittest discover -s tests -p "test*.py"
```

The validator writes a secret-free JSON decision to stdout. Exit `0` means valid; exit `2` means the file could not be read or parsed; exit `3` means policy validation failed.

## Integration requirements

Validation is a preflight check, not a runtime replay store. A production handler must verify the signature over the exact raw bytes, compare timestamps using a trusted clock, atomically claim a provider event identifier, bind the identifier to a payload digest, and define duplicate and crash-recovery behavior. Apply datastore, deployment, secret, and production configuration changes only with the required human approval.
