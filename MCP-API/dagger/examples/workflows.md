# Dagger connector workflows

## Inspect engine
Tool: `dagger.engine.version`; input `{}`; permission READ; approval no. Output wraps GraphQL data and marks it untrusted.

## Read repository file
Tool: `dagger.git.file.read`; input `{"url":"https://github.com/dagger/dagger","ref":"main","path":"README.md"}`; permission READ; approval no.

## Inspect an image
Tool: `dagger.container.inspect`; input `{"address":"alpine:3.22"}`; permission READ; approval no.

## Execute isolated command
Tool: `dagger.container.exec`; input `{"image":"alpine:3.22","args":["sh","-lc","uname -a"],"approved":true}`; permission HIGH_RISK; explicit approval required by default.
