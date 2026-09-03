# Hook: Preflight Boundary Check

## Trigger
Before enabling or deploying an MCP SSE client/transport change.

## Preconditions
Policy file exists and valid/adversarial fixtures are available.

## Action
Run:

```bash
python scripts/sse_boundary_probe.py --policy config/policy.json --fixture tests/fixtures/delimiter-free.bin
python -m unittest tests/test_sse_boundary_probe.py
```

The first command is expected to produce a controlled `limit_exceeded` result for the adversarial fixture; unit tests verify both failure and normal-event behavior.

## Expected result
Exit 0 from the test suite and a probe report showing `buffered_bytes <= max_incomplete_frame_bytes` before abort.

## Failure behavior
Block deployment/completion. Do not raise memory limits or disable the probe to obtain a pass.

## Blocking
Yes.
