# Daily AI Engineering Security, Performance, and Thinking

A collection of advanced guards and measurement packages for agent security boundaries, runtime integrity, context efficiency, tool orchestration, permission handling, and failure recovery.

## Intended use

These packages are controls and reference implementations for teams building or operating agent systems. They are not universal runtime plugins: the host must map each rule, hook, schema, and script to its own tool protocol, approval system, telemetry, and sandbox model.

Use a package when its threat model or performance problem is present and measurable. Do not install every guard by default; overlapping controls can add latency, duplicate decisions, or create conflicting policy.

## Common package structure

| Path | Purpose |
| --- | --- |
| `evidence/` | Research basis, observations, and limits of the claim. |
| `README.md` | Integration contract and operational instructions. |
| `rules/` and `skills/` | Mandatory constraints and bounded procedures. |
| `workflows/` and `hooks/` | Lifecycle placement and blocking behavior. |
| `config/` and `schemas/` | Policy inputs and evidence contracts. |
| `scripts/` and `tests/` | Deterministic evaluator and regression verification. |

A research- or guidance-only package must be treated as non-executable until it includes an implementation and verification path.

## Prerequisites

- Python 3.10 or newer for Python utilities; Python 3.11+ is recommended.
- Bash for shell hooks where present. Run them explicitly with `bash` on platforms that do not preserve executable mode.
- Access to runtime events, tool metadata, or session evidence required by the selected guard.
- A disposable validation environment for sandbox, filesystem, network, credential, or side-effect probes.

Install the shared Python dependencies from this directory:

```bash
python -m venv .venv
source .venv/bin/activate          # Windows PowerShell: .venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python -m pip install -r requirements-dev.txt
```

## Integration workflow

1. Read the research evidence and separate observed facts from interpretation.
2. Define the expected policy, boundary, or baseline before running the evaluator.
3. Review package configuration and replace example thresholds with measured values.
4. Run only harmless probes against synthetic fixtures.
5. Integrate the hook at the lifecycle point documented by the package.
6. Store the decision and evidence without storing secrets or unnecessary raw context.
7. Test fail-open, fail-closed, unknown, cancellation, and recovery paths.
8. Re-run after runtime, model, policy, tool, or configuration changes.

Common test commands, when supported by a package, are:

```bash
python -m unittest discover -s tests -p "test*.py"
python -m pytest tests
```

## Safety requirements

- Never use real secrets as redaction or egress fixtures.
- Never use production paths, accounts, remote hosts, or destructive actions as boundary canaries.
- Treat external tools and MCP servers as separate principals unless transitive enforcement is proven.
- Block high-autonomy execution on unknown or fail-open results.
- Record runtime version, policy revision, tool inventory, input provenance, and evaluator version with evidence.
- Bound retries and optimization loops; a repeated policy failure is not an instrumentation retry.

See [SECURITY.md](../SECURITY.md) for private vulnerability reporting and [CONTRIBUTING.md](../CONTRIBUTING.md) for package standards.
