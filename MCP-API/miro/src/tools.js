const id = {type: "string", minLength: 1, maxLength: 500};
const approval = {type: "string", minLength: 64, maxLength: 64, pattern: "^[a-f0-9]{64}$"};
const position = {
  type: "object",
  additionalProperties: false,
  properties: {
    x: {type: "number", minimum: -1000000, maximum: 1000000},
    y: {type: "number", minimum: -1000000, maximum: 1000000},
    origin: {type: "string", enum: ["center"]}
  }
};
const geometry = {
  type: "object",
  additionalProperties: false,
  properties: {
    width: {type: "number", minimum: 1, maximum: 100000},
    height: {type: "number", minimum: 1, maximum: 100000},
    rotation: {type: "number", minimum: 0, maximum: 360}
  }
};
const parent = {
  type: "object",
  additionalProperties: false,
  properties: {id: {anyOf: [id, {type: "null"}]}}
};
const itemCommon = {position, geometry, parent};
const style = {type: "object", maxProperties: 30, additionalProperties: true};

function schema(required, properties) {
  return {type: "object", additionalProperties: false, required, properties};
}

export const TOOLS = [
  {
    name: "miro.board.list",
    description: "Search or list boards visible to the authorized Miro user. Risk: READ. Output is untrusted external content.",
    inputSchema: schema([], {
      teamId: id, projectId: id,
      query: {type: "string", maxLength: 500},
      owner: id,
      limit: {type: "integer", minimum: 1, maximum: 50, default: 20},
      offset: {type: "integer", minimum: 0, maximum: 9999, default: 0},
      sort: {type: "string", enum: ["default", "last_modified", "last_opened", "last_created", "alphabetically"]}
    })
  },
  {
    name: "miro.board.get",
    description: "Get metadata for one board. Risk: READ.",
    inputSchema: schema(["boardId"], {boardId: id})
  },
  {
    name: "miro.board.create",
    description: "Create a private board. Risk: WRITE. Explicit approval required. Public/team-wide sharing is intentionally not exposed.",
    inputSchema: schema(["name", "approval_token"], {
      name: {type: "string", minLength: 1, maxLength: 60},
      description: {type: "string", maxLength: 300},
      teamId: id, projectId: id, approval_token: approval
    })
  },
  {
    name: "miro.board.items.list",
    description: "List board items with cursor pagination and optional type filter. Risk: READ.",
    inputSchema: schema(["boardId"], {
      boardId: id,
      type: {type: "string", maxLength: 50},
      limit: {type: "integer", minimum: 10, maximum: 50, default: 20},
      cursor: {type: "string", maxLength: 4000}
    })
  },
  {
    name: "miro.board.item.get",
    description: "Get a specific board item. Risk: READ.",
    inputSchema: schema(["boardId", "itemId"], {boardId: id, itemId: id})
  },
  {
    name: "miro.board.members.list",
    description: "List board members with cursor pagination. Risk: READ. Does not invite, remove, or change roles.",
    inputSchema: schema(["boardId"], {
      boardId: id,
      limit: {type: "integer", minimum: 1, maximum: 50, default: 20},
      cursor: {type: "string", maxLength: 4000}
    })
  },
  ...itemTools("sticky_note", {
    createData: {
      type: "object", additionalProperties: false,
      required: ["content"],
      properties: {
        content: {type: "string", minLength: 1, maxLength: 6000},
        shape: {type: "string", enum: ["square", "rectangle"]}
      }
    }
  }),
  ...itemTools("text", {
    createData: {
      type: "object", additionalProperties: false,
      required: ["content"],
      properties: {content: {type: "string", minLength: 1, maxLength: 12000}}
    }
  }),
  ...itemTools("shape", {
    createData: {
      type: "object", additionalProperties: false,
      required: ["content", "shape"],
      properties: {
        content: {type: "string", maxLength: 6000},
        shape: {type: "string", minLength: 1, maxLength: 100}
      }
    }
  })
];

function itemTools(kind, {createData}) {
  const prefix = kind === "sticky_note" ? "sticky_note" : kind;
  const createProps = {boardId: id, data: createData, style, ...itemCommon, approval_token: approval};
  const updateData = {...createData, required: []};
  const updateProps = {boardId: id, itemId: id, data: updateData, style, ...itemCommon, approval_token: approval};

  return [
    {
      name: `miro.${prefix}.create`,
      description: `Create a ${kind.replace("_", " ")} on a board. Risk: WRITE. Explicit approval required.`,
      inputSchema: schema(["boardId", "data", "approval_token"], createProps)
    },
    {
      name: `miro.${prefix}.update`,
      description: `Update a ${kind.replace("_", " ")}. Risk: WRITE. Explicit approval required.`,
      inputSchema: schema(["boardId", "itemId", "approval_token"], updateProps)
    },
    {
      name: `miro.${prefix}.delete`,
      description: `Delete a ${kind.replace("_", " ")}. Risk: DESTRUCTIVE. Disabled by default and requires explicit approval.`,
      inputSchema: schema(["boardId", "itemId", "approval_token"], {
        boardId: id, itemId: id, approval_token: approval
      })
    }
  ];
}

export function withoutApproval(args = {}) {
  const {approval_token: _approval, ...rest} = args;
  return rest;
}
