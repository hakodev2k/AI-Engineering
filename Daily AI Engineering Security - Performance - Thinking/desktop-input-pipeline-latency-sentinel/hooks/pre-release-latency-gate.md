# Hook: Pre-Release Input Latency Gate

## Trigger
Before promoting a Windows desktop-agent build that changes Electron/Chromium, overlays, computer-use integration, polling, task rendering or background workers.

## Preconditions / Action
Collect `baseline.jsonl` with app exited and `affected.jsonl` under the release scenario. Run `python scripts/analyze_input_trace.py affected.jsonl --baseline baseline.jsonl`.

## Expected result
Exit 0 and `decision=pass`.

## Failure behavior / Blocking
Exit 10 blocks release pending investigation. Exit 2 blocks because measurement is invalid. Do not relax thresholds solely to ship. A platform waiver requires explicit human approval and evidence.
