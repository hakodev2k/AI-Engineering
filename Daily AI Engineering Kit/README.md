# Daily AI Engineering Kit

A collection of reusable engineering gates, guards, investigators, and workflow packages for AI-assisted software delivery. Each child directory is an independent package and should be adopted only when its problem statement and risk profile match the target repository.

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

## Prerequisites

- A Markdown-capable agent or documentation workflow for all packages.
- Python 3.10 or newer for Python scripts. Python 3.11+ is recommended.
- Bash for `.sh` utilities. Invoke repository scripts as `bash path/to/script.sh` because executable file-mode support varies across platforms.
- Package-specific tools named in the package README, such as Git, .NET, Docker, or a database client.

## Install Python dependencies

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

The collection-level dependency files cover scripts in this repository. When copying one package elsewhere, keep only the dependencies imported by that package and follow its README.

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
