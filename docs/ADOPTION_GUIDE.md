# Standalone Adoption Guide

This repository is a source library. Adopt only the rule, skill, role, engineering control, or connector needed by the target repository; do not install or load every collection as one system.

## Choose the copy unit

| Selection | Copy | Do not assume |
| --- | --- | --- |
| One rule | The selected `.md` file | Other rules in the same discipline are loaded |
| One skill | The selected `.md` file | The discipline index or sibling skills are required |
| One role | The complete role child directory | Collection-level files will exist in the target repository |
| One kit or guard | The complete package child directory | A script works without its local config, schema, fixtures, or tests |
| One MCP/API connector | The complete provider directory | Credentials or provider permissions are configured automatically |

The package `README.md` is the entry point for a role, kit, guard, or connector. If a required asset is not inside that package or explicitly described there, treat the package as incomplete and report it instead of guessing.

## Select before copying

1. Define the target problem and the agent's authority boundary.
2. Search the collection index and compare package problem statements.
3. Read the candidate README, limitations, required inputs, side effects, and approval gates.
4. Reject a package that assumes unavailable runtime events, tools, evidence, or permissions.
5. Prefer the smallest selection that covers the problem.

Similar package names can represent different failure modes. Select by contract and evidence, not by name alone.

For common Role, Rule, Skill, gate, and MCP combinations, see the [composition guide](COMPOSITION_GUIDE.md). Its map identifies when a full role package is the appropriate source instead of a similarly named but differently scoped document.

## Obtain selected content

For an individual rule or skill, copy the raw Markdown file through the repository browser or from an existing checkout.

For one or more complete packages without downloading the full working tree, use Git sparse checkout. The following example selects a .NET role plus its matching Rules and Skills directories:

```bash
git clone --filter=blob:none --no-checkout https://github.com/hakodev2k/AI-Engineering.git ai-engineering-selection
cd ai-engineering-selection
git sparse-checkout init --cone
git sparse-checkout set "Daily AI Role/dotnet-backend-developer" "Rules/dotnet-backend-developer" "Skills/dotnet-backend-developer"
git checkout main
```

Copy the selected paths into the target repository after inspection. The temporary sparse checkout remains an upstream reference and is not part of the target application's runtime.

## Choose target locations

The library is tool-neutral. Use locations recognized by the target agent and repository. One possible layout is:

```text
target-repository/
└── .ai/
    ├── roles/<selected-role>/
    ├── rules/<selected-rule>.md
    ├── skills/<selected-skill>.md
    └── controls/<selected-kit>/
```

Do not rename internal package paths until its scripts, schemas, and Markdown references have been checked. If the target platform requires an adapter file, keep that adapter outside the copied package and point it to the package entry point.

## Install only local requirements

Guidance-only Markdown requires no installation. For executable content:

1. use the runtime version declared by the selected package;
2. run commands from the directory stated by its README;
3. install only dependencies declared in that package or its exact install command;
4. keep secrets in the target environment's secret manager;
5. begin with synthetic, disposable, or read-only inputs.

Root `package.json` files, root audit dependencies, and collection-level convenience requirements maintain this source repository. They are not implicit dependencies of copied packages.

## Integrate deliberately

Before enabling a selected asset, map its generic concepts to the target repository:

- agent instruction or discovery path;
- lifecycle event or hook location;
- input and output schemas;
- project-specific build, test, lint, and security commands;
- allowlists, permissions, approval owners, and stop conditions;
- evidence destination, retention, redaction, and access control;
- failure mode, rollback, monitoring, and operational owner.

Rules and skills guide behavior but do not grant tool access. A role describes responsibility but does not replace human accountability. A reference script must be reviewed before it is connected to production state.

## Verify the copied unit

- Check that every required relative path resolves inside the copied role or package.
- Run the package-local self-check or tests when provided.
- Validate included examples against schemas before using real data.
- Confirm documented failure and non-zero exit behavior.
- Exercise fail-open, fail-closed, cancellation, and unavailable-dependency paths when relevant.
- Verify target-specific integration separately; passing a package self-check does not prove production readiness.

If no executable component exists, review the document for complete purpose, inputs, constraints, procedure, verification, expected output, escalation, and limitations.

## Record provenance

Keep a short adoption record in the target repository so future maintainers can compare upstream changes:

```yaml
source: https://github.com/hakodev2k/AI-Engineering
revision: <commit-or-release>
selected_paths:
  - Daily AI Role/dotnet-backend-developer
target_paths:
  - .ai/roles/dotnet-backend-developer
local_changes: <summary-or-none>
verified_with: <commands-and-date>
owner: <team-or-role>
```

Never place credentials or sensitive environment details in the adoption record.

Review the repository [MIT License](../LICENSE) before redistribution. Preserve the license and applicable attribution with copied or redistributed material, using the target repository's established third-party notice process. This guide is operational guidance, not legal advice.

## Update safely

1. Fetch or download the new upstream revision.
2. Compare only the adopted paths and read their changelog or README changes.
3. Preserve intentional target-repository adaptations.
4. Review dependency, schema, permission, side-effect, and approval changes.
5. Re-run package-local and target integration verification.
6. Update the recorded revision only after the new copy is accepted.

Do not overwrite a customized package blindly. Treat upstream updates like any other dependency change with review, evidence, and rollback.

## Consumer completion checklist

- [ ] The selected unit matches a defined problem.
- [ ] The complete supported copy unit is present.
- [ ] Required files and links resolve without the parent collection.
- [ ] Package-local prerequisites and dependencies are satisfied.
- [ ] Secrets and production data are absent from examples and source control.
- [ ] Target commands, paths, permissions, and approvals are mapped.
- [ ] Harmless package verification and target integration tests pass.
- [ ] Limitations, residual risk, rollback, owner, and upstream revision are recorded.
- [ ] Applicable license and attribution notices are preserved.
