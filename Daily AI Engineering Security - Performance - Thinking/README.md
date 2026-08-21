# Daily AI Engineering Security, Performance, and Thinking

A collection of advanced guards and measurement packages for agent security boundaries, runtime integrity, context efficiency, tool orchestration, permission handling, and failure recovery.

Browse the complete alphabetical [standalone package catalog](CATALOG.md) to select a control by purpose, runtime type, and topic.

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

## Runtime classification

- **Executable guard/probe:** has a deterministic `scripts/` or hook entrypoint. Run only the command documented by the package and interpret unknown, invalid, or stale evidence as blocked unless its policy explicitly says otherwise.
- **Reference-only control:** contains research, rules, skills, or templates but no runnable evaluator. It needs no installation and is not enforced until the host implements the documented lifecycle binding.
- **Host adapter required:** includes an evaluator but depends on runtime events, identity, approval, sandbox, or telemetry supplied by the host. Validate the adapter separately; a passing fixture does not prove the real boundary.

The package README is authoritative for its entrypoint. Executable files are reference implementations, not automatically installed commands or production integrations.

## Prerequisites

- Python 3.10 or newer for Python utilities; Python 3.11+ is recommended.
- Bash for shell hooks where present. Run them explicitly with `bash` on platforms that do not preserve executable mode.
- Access to runtime events, tool metadata, or session evidence required by the selected guard.
- A disposable validation environment for sandbox, filesystem, network, credential, or side-effect probes.

Maintainers may install the shared source-repository dependencies from this directory:

```bash
python -m venv .venv
source .venv/bin/activate          # Windows PowerShell: .venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python -m pip install -r requirements-dev.txt
```

Consumers who copy one package should instead use that package's local dependency file or exact README install command; the collection root is not required.

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

Maintainers can run `npm run audit:strict` from the repository root for documentation, link, structured-file, JSON Schema, and Python syntax checks. Consumers who copy one package do not need the root npm workspace. This static audit is additive to package-local tests and cannot prove runtime policy enforcement.

## Package readiness contract

Do not enable a copied guard until its README identifies its input and output, exit-code meaning, lifecycle placement, fail-open/fail-closed behavior, evidence freshness rule, side effects, and verification command. Treat a missing adapter or unknown result as a blocked integration for high-autonomy or high-impact actions. Use synthetic examples only and keep generated evidence outside the package.

## Safety requirements

- Never use real secrets as redaction or egress fixtures.
- Never use production paths, accounts, remote hosts, or destructive actions as boundary canaries.
- Treat external tools and MCP servers as separate principals unless transitive enforcement is proven.
- Block high-autonomy execution on unknown or fail-open results.
- Record runtime version, policy revision, tool inventory, input provenance, and evaluator version with evidence.
- Bound retries and optimization loops; a repeated policy failure is not an instrumentation retry.

See [SECURITY.md](../SECURITY.md) for private vulnerability reporting and [CONTRIBUTING.md](../CONTRIBUTING.md) for package standards.
