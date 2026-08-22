# Pull request

## Summary

Describe the problem and the outcome of this change.

## Change type

- [ ] Documentation
- [ ] Role, rule, or skill
- [ ] Engineering gate or guard
- [ ] MCP/API connector
- [ ] Repository tooling or maintenance
- [ ] Breaking change

## Verification

List the exact commands or checks run and summarize their results.

```text
npm run check
```

For an executable package or connector, also list the package-local commands that were run. Do not report a repository audit as proof that provider or runtime behavior was tested.

## Risk and compatibility

Describe security, privacy, permission, external-side-effect, dependency, and compatibility implications. Write `None identified` only after reviewing them.

## Checklist

- [ ] The change is focused and contains no unrelated generated artifacts.
- [ ] Documentation, examples, commands, and links match the behavior.
- [ ] The supported copy unit contains or documents every required local dependency.
- [ ] Similar content was reviewed; overlap and selection differences are documented.
- [ ] Relevant schemas, scripts, builds, and tests were checked.
- [ ] No secrets, personal data, proprietary content, or unsafe fixtures are included.
- [ ] Approval boundaries and destructive or externally visible actions are explicit.
- [ ] Breaking changes include migration guidance.
- [ ] The changelog is updated when the change is user-facing.
- [ ] I have read `CONTRIBUTING.md` and follow the Code of Conduct.
