# Effective Sandbox Boundary Probe

A deterministic evaluator for comparing a declared agent sandbox policy with harmless observed effects. It detects fail-open, fail-closed, and unknown boundaries before high-autonomy execution is enabled.

## Safety boundary

This package evaluates observations supplied by an operator; it does not perform filesystem, network, remote-execution, or destructive probes itself. Create canaries only in an explicitly disposable fixture. Never target production paths, real secrets, real remote hosts, or data you do not own.

## Package contents

```text
effective-sandbox-boundary-probe/
├── README.md
├── evidence/research.md
├── examples/observations.example.json
├── hooks/pre-autonomy.md
├── rules/boundary-rules.md
├── scripts/evaluate_boundary.py
├── skills/verify-effective-boundary.md
├── subagents/boundary-reviewer.md
├── tests/test_evaluate_boundary.py
└── workflows/verify-boundary.md
```

## Prerequisites

Python 3.10 or newer. The evaluator uses only the Python standard library.

## Prepare observations

Copy `examples/observations.example.json` to an evidence location outside the package. Record the exact runtime version, execution surface, declared sandbox, policy revision, resolved configuration sources, and observation time. Define each expected result before executing the harmless canary.

External executors must be listed separately because a local filesystem sandbox does not prove their boundary. Mark them approved only after an explicit review by the responsible owner.

## Run

From this package directory:

```bash
python scripts/evaluate_boundary.py examples/observations.example.json
python -m unittest discover -s tests -p "test*.py"
```

Exit codes:

| Code | Result | Action |
| ---: | --- | --- |
| `0` | `PASS` | The supplied observations match the declared expectations. |
| `2` | `FAIL_OPEN` | Block autonomy; an expected denial succeeded. |
| `3` | `UNKNOWN` or invalid evidence | Block autonomy until evidence is complete. |
| `4` | `FAIL_CLOSED` | Investigate availability without weakening policy automatically. |

The example is designed to pass as a format demonstration; it is not evidence about your runtime.

## Operational use

Follow `workflows/verify-boundary.md`, apply `rules/boundary-rules.md`, and run the hook immediately before unattended execution. Persist the observation input and evaluator output together. Re-run after runtime, surface, policy, configuration, trust, or tool-inventory changes.
