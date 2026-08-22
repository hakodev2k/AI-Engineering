# Frequently Asked Questions

## Is this repository one application to install?

No. It is a source library. Developers select and copy individual Rules, Skills, role packages, engineering controls, or provider connectors into another repository. Root tooling exists for maintainers and is not a runtime dependency of copied content.

## What is the smallest supported copy unit?

- One Rule or Skill: copy the selected Markdown file.
- One Role, kit, guard, or MCP connector: copy the complete child directory.

Copying only part of a package can omit required schemas, configuration, examples, scripts, tests, or local documentation. See the [adoption guide](ADOPTION_GUIDE.md) for the complete contract.

## Should I start with a Role, Rule, or Skill?

Start with the problem:

- choose a **Role** for ownership, a broader operating workflow, handoffs, and completion criteria;
- choose a **Rule** for a mandatory constraint;
- choose a **Skill** for a focused repeatable procedure;
- choose a **kit or guard** for a concrete gate, evidence workflow, or runtime boundary;
- choose an **MCP connector** only for required access to a named external provider.

The [composition guide](COMPOSITION_GUIDE.md) maps common outcomes to compatible choices.

## Should I copy every matching file?

Usually not. Load the smallest set that covers the task and its risk. Unrelated instructions increase context size and can create overlapping responsibilities or conflicting assumptions.

## What if two packages or skills look similar?

Compare their trigger, owner, inputs, outputs, lifecycle, side effects, and stop conditions. Similar names may still represent different failure modes. If the distinction is unclear, report a documentation or overlap issue rather than selecting both by default. The [content quality standard](CONTENT_QUALITY.md) explains how maintainers resolve overlap.

## Does a Rule or Role grant permission to act?

No. Repository content describes behavior and responsibility; it does not grant credentials, production access, financial authority, permission to communicate externally, or approval for destructive or irreversible actions. The target repository's policy and human approval boundary remain authoritative.

## Are packages production-ready?

No universal production-readiness claim is made. Packages are reusable guidance or reference implementations. Adopters must review code and instructions, map host-specific integration points, validate dependencies and permissions, test with safe inputs, and define monitoring, rollback, and ownership.

## How do I install an MCP connector?

Copy one complete provider directory, read its README and manifest, install dependencies from that connector directory, and run only its documented scripts. Configure a least-privilege credential and begin with read-only tools against a test account. Do not install every connector as one application.

## Do copied files receive updates automatically?

No. Record the upstream revision and selected paths in the target repository. To update, compare only those paths, preserve local adaptations, review dependency and permission changes, re-run local verification, and then update the provenance record.

## Can I modify copied content?

Yes. Adapt it to the target repository's agent runtime, policies, commands, architecture, and approval model. Keep a record of local changes so future upstream comparisons do not overwrite intentional customization.

## Why do some packages contain scripts while others contain only Markdown?

Some assets are executable reference gates or validators; others are behavioral contracts that need host integration. A script demonstrates or validates a bounded behavior but does not automatically install or enforce the package. A guidance-only package requires no dependency installation.

## What should I report as a repository problem?

Report broken or stale instructions, missing package-local dependencies, commands that do not match files, invalid schemas/examples, unclear copy boundaries, unsafe defaults, overlapping content without selection guidance, and missing verification or approval boundaries. Use the repository issue templates and remove secrets or private data.

## How should I contribute a new asset?

Search for similar content first, explain why an existing asset cannot be extended, define the supported copy unit, and provide verification and safety boundaries appropriate to the content type. Read [CONTRIBUTING.md](../CONTRIBUTING.md) and the [content quality standard](CONTENT_QUALITY.md) before opening a proposal.
