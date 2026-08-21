# Daily AI Engineering Kit

A collection of reusable engineering gates, guards, investigators, and workflow packages for AI-assisted software delivery. Each child directory is an independent package and should be adopted only when its problem statement and risk profile match the target repository.

Browse the complete alphabetical [standalone package catalog](CATALOG.md) to select a package by purpose, runtime type, and topic.

## Package model

Most packages combine some of the following assets:

| Path | Responsibility |
| --- | --- |
| `README.md` | Purpose, architecture, installation, usage, and verification entrypoint. |
| `rules/` | Mandatory safety and quality constraints. |
| `skills/` | Bounded procedures for investigation or implementation. |
| `workflows/` | Stage ordering, checkpoints, retries, and completion criteria. |
| `hooks/` | Lifecycle integration guidance. |
| `schemas/` | Machine-readable contracts and evidence formats. |
| `config/` | Example policy or threshold configuration. |
| `scripts/` | Deterministic checks or reference implementations. |
| `tests/` | Package-level regression checks. |
| `templates/` and `examples/` | Safe starting inputs and expected artifact shapes. |

Not every package is executable. A package containing only rules, skills, or research is a reference package; its README must state that no install or run step is required.

## Runtime classification

Classify a package from its own files before adopting it:

- **Executable gate/guard:** contains a runnable file under `scripts/` or `hooks/`. Run it only with the inputs and working directory documented by that package. A script that only inspects or initializes evidence does not authorize the protected change.
- **Reference workflow:** contains Markdown contracts but no runnable implementation. It requires no dependency installation; integrate its rules, skills, hooks, and workflow into the host before claiming it is enforced.
- **Adapter required:** documents a lifecycle hook or orchestration contract whose host-specific binding is intentionally absent. The adopter must implement that binding and verify both allow and deny paths.

Presence of a script means only that the package has a reference implementation. It does not make the package a globally installed command, background service, CI integration, or production-safe automation.

## Prerequisites

- A Markdown-capable agent or documentation workflow for all packages.
- Python 3.10 or newer for Python scripts. Python 3.11+ is recommended.
- Bash for `.sh` utilities. Invoke repository scripts as `bash path/to/script.sh` because executable file-mode support varies across platforms.
- Package-specific tools named in the package README, such as Git, .NET, Docker, or a database client.

## Maintainer environment

From this collection directory:

```bash
python -m venv .venv
source .venv/bin/activate          # Windows PowerShell: .venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

For tests that use pytest-style discovery, also run:

```bash
python -m pip install -r requirements-dev.txt
```

The collection-level dependency files are convenience tooling for maintainers of this source repository. They are not part of the standalone package contract. When copying one package elsewhere, use only its package-local dependency file or the exact install command in that package's README.

## Use a package

1. Select a package by its problem statement, not only by its name.
2. Read its `README.md`, rules, workflow, and approval boundaries.
3. Review configuration and schemas before executing any script.
4. Run commands from the package root so relative paths resolve consistently.
5. Use example or synthetic data first; never point a reference script at production by default.
6. Preserve verification evidence and require human approval for destructive, privileged, production, or externally visible actions.

Typical validation commands are:

```bash
python scripts/verify_package.py
python -m unittest discover -s tests -p "test*.py"
python -m pytest tests
```

Use only commands actually supported by the selected package. A missing test directory does not imply that a generic test command is valid.

Maintainers can run `npm run audit:strict` from the repository root to check documentation presence, local links, JSON/JSON Schema, YAML, and Python syntax. Consumers who copy one package do not need the root npm workspace. This static audit does not replace package tests or host-repository verification.

## Package readiness contract

Before enabling a copied package, confirm that its README identifies its runtime type, exact entrypoint, input/output contract, exit-code meaning, verification command, side effects, and approval boundary. Treat missing information as a blocked integration rather than guessing. Example inputs are synthetic; generated reports and artifacts should go to an ignored working directory, not back into the package.

## Configuration and secrets

Committed configuration is a template or policy baseline. Store credentials in the target environment's secret manager, never in these packages. Inspect scripts before use, constrain filesystem and network access, and confirm that logs and evidence files cannot contain secrets or personal data.

## Adoption checklist

- [ ] The package problem matches the target change.
- [ ] Required runtime and package-specific dependencies are installed.
- [ ] Configuration, thresholds, paths, and schemas are reviewed.
- [ ] Scripts are run against disposable or synthetic inputs first.
- [ ] Tests and deterministic validators pass.
- [ ] External side effects and approval boundaries are documented.
- [ ] Production integration has an owner, rollback path, and monitoring plan.

See the repository [contribution guide](../CONTRIBUTING.md) before adding or restructuring a package.
