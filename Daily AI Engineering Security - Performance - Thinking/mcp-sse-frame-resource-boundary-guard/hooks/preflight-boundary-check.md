# Hook: Preflight Boundary Check

## Trigger
Before enabling or deploying an MCP SSE client/transport change.

## Preconditions
Policy and local valid/adversarial fixtures are available.

## Action
Run:

```bash
python scripts/sse_boundary_probe.py --policy tests/fixtures/test-policy.json --fixture tests/fixtures/delimiter-free.bin --chunk-size 16
python -m unittest tests/test_sse_boundary_probe.py
```

The first command must produce a controlled `limit_exceeded` result for the adversarial fixture; unit tests verify both failure and normal-event behavior.

## Expected result
The probe reports `limit_exceeded` with `buffered_bytes <= max_incomplete_frame_bytes`, and the unit-test suite exits 0.

## Failure behavior
Block deployment/completion. Do not raise memory limits or disable the probe to obtain a pass.

## Blocking
Yes.
