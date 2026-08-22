# Tool-call examples

Provider content is untrusted data. These examples contain no credentials.

| Tool | Example input | Permission | Approval |
|---|---|---|---|
| `huggingface.model.search` | `{ "search": "text embedding", "limit": 10 }` | Hub read | No |
| `huggingface.model.get` | `{ "repo_id": "sentence-transformers/all-MiniLM-L6-v2" }` | Hub read | No |
| `huggingface.dataset.search` | `{ "search": "finance", "limit": 10 }` | Hub read | No |
| `huggingface.dataset.get` | `{ "repo_id": "openai/gsm8k" }` | Hub read | No |
| `huggingface.space.search` | `{ "search": "image generation", "limit": 10 }` | Hub read | No |
| `huggingface.space.get` | `{ "repo_id": "black-forest-labs/FLUX.1-schnell" }` | Hub read | No |
| `huggingface.repo.file.list` | `{ "repo_id": "sentence-transformers/all-MiniLM-L6-v2", "repo_type": "model", "revision": "main" }` | Hub read | No |
| `huggingface.user.whoami` | `{}` | Token identity read | No |
| `huggingface.inference.chat` | `{ "model": "openai/gpt-oss-120b:groq", "messages": [{"role":"user","content":"Summarize this architecture"}], "max_tokens": 300 }` | Inference Providers | Yes by default |
| `huggingface.repo.create` | `{ "name": "agent-evals", "type": "dataset", "private": true }` | Repo write | Yes by default |
| `huggingface.repo.delete` | `{ "repo_id": "example/agent-evals", "repo_type": "dataset" }` | Repo delete | Strong approval + destructive enable |

Successful calls return provider JSON as formatted MCP text content. Provider errors are surfaced without intentionally exposing `HF_TOKEN`.
