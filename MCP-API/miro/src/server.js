import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { loadConfig } from "./config.js";
import { CredentialProvider } from "./credentials.js";
import { MiroClient, MiroError } from "./client.js";
import { authorize } from "./policy.js";
import { TOOLS, withoutApproval } from "./tools.js";
import { sanitize } from "./sanitize.js";

export function createServer({config = loadConfig(), client = null} = {}) {
  const credentials = client ? null : new CredentialProvider(config);
  const api = client || new MiroClient(config, credentials);
  const server = new Server({name: "miro-safe-connector", version: "1.0.0"}, {capabilities: {tools: {}}});

  server.setRequestHandler(ListToolsRequestSchema, async () => ({tools: TOOLS}));

  server.setRequestHandler(CallToolRequestSchema, async (request, extra) => {
    const name = request.params.name;
    const args = request.params.arguments || {};
    const payload = withoutApproval(args);

    try {
      authorize(config, name, payload, args.approval_token);
      const signal = extra?.signal;
      let result;

      switch (name) {
        case "miro.board.list": result = await api.listBoards(payload, signal); break;
        case "miro.board.get": result = await api.getBoard(payload, signal); break;
        case "miro.board.create": result = await api.createBoard(payload, signal); break;
        case "miro.board.items.list": result = await api.listItems(payload, signal); break;
        case "miro.board.item.get": result = await api.getItem(payload, signal); break;
        case "miro.board.members.list": result = await api.listMembers(payload, signal); break;
        case "miro.sticky_note.create": result = await api.createItem("sticky_note", payload, signal); break;
        case "miro.sticky_note.update": result = await api.updateItem("sticky_note", payload, signal); break;
        case "miro.sticky_note.delete": result = await api.deleteItem("sticky_note", payload, signal); break;
        case "miro.text.create": result = await api.createItem("text", payload, signal); break;
        case "miro.text.update": result = await api.updateItem("text", payload, signal); break;
        case "miro.text.delete": result = await api.deleteItem("text", payload, signal); break;
        case "miro.shape.create": result = await api.createItem("shape", payload, signal); break;
        case "miro.shape.update": result = await api.updateItem("shape", payload, signal); break;
        case "miro.shape.delete": result = await api.deleteItem("shape", payload, signal); break;
        default: throw new Error(`Unknown tool: ${name}`);
      }

      const clean = sanitize(result);
      return {
        content: [{type: "text", text: JSON.stringify({untrusted_provider_data: true, data: clean}, null, 2)}],
        structuredContent: {untrusted_provider_data: true, data: clean}
      };
    } catch (error) {
      return {isError: true, content: [{type: "text", text: JSON.stringify(normalizeError(error))}]};
    }
  });

  return server;
}

function normalizeError(error) {
  if (error instanceof MiroError) {
    return {
      error: error.message,
      status: error.status,
      retryAfter: error.retryAfter,
      retryable: error.status === 429 || (error.status >= 500 && error.status <= 599)
    };
  }
  return {error: error?.message || String(error), retryable: false};
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const server = createServer();
  await server.connect(new StdioServerTransport());
}
