# Repository Discovery Metadata

This page records recommended GitHub metadata for maintainers. Repository About fields, topics, and the social preview are configured in GitHub settings and are not controlled by Markdown alone.

## Recommended description

> Pick-and-copy AI engineering roles, rules, skills, safety gates, and MCP connectors for real software repositories.

Keep the description outcome-oriented and avoid suggesting that the repository is one installable framework.

## Recommended topics

Use a focused subset of the following public topics:

```text
ai-engineering
ai-agents
agentic-ai
coding-agents
developer-tools
software-engineering
prompt-engineering
mcp
model-context-protocol
devops
site-reliability-engineering
application-security
dotnet
reusable-workflows
```

Topics should describe the repository as a whole. Do not add a provider or framework topic solely because one optional package mentions it.

## Social preview specification

The prepared upload asset is [`assets/social-preview.jpg`](assets/social-preview.jpg). Upload this file through GitHub repository Settings → Social preview; committing it does not automatically change the GitHub preview.

- Canvas: 1280 × 640 pixels, PNG or JPG, under GitHub's upload limit.
- Primary text: `AI Engineering`.
- Supporting text: `Pick roles · rules · skills · safety gates · MCP connectors`.
- Visual structure: six clearly separated modules representing the top-level collections.
- Keep text large, high contrast, and readable at link-preview size.
- Avoid provider logos, certification marks, popularity claims, or compatibility claims that require permission or continuous verification.
- Check the image against both light and dark surrounding interfaces before uploading it in repository settings.

## About-section checklist

- [ ] Description matches the pick-and-copy model.
- [ ] Website points to an maintained project page, or remains empty rather than pointing to a placeholder.
- [ ] Topics are configured and remain relevant to the whole repository.
- [ ] Releases, packages, deployments, and sponsorship are enabled only when actually used.
- [ ] Discussions are enabled only when maintainers can respond and moderate them.
- [ ] Social preview is current, readable, and free of unsupported claims.

Review this metadata whenever the repository name, top-level collections, audience, or project identity changes.
