import type { Risk } from "./policy.js";
export type ToolRoute={external:string;upstream:string;risk:Risk;purpose:string};
export const TOOL_ROUTES:readonly ToolRoute[]=[
 {external:"cockroachdb.cluster.get",upstream:"get_cluster",risk:"READ",purpose:"Read cluster identity and version metadata."},
 {external:"cockroachdb.database.list",upstream:"list_databases",risk:"READ",purpose:"List databases with bounded pagination."},
 {external:"cockroachdb.table.list",upstream:"list_tables",risk:"READ",purpose:"List tables in a database."},
 {external:"cockroachdb.table.schema.get",upstream:"get_table_schema",risk:"READ",purpose:"Read a table CREATE TABLE schema."},
 {external:"cockroachdb.sql_user.list",upstream:"list_sql_users",risk:"READ",purpose:"List SQL users visible to the authorized role."},
 {external:"cockroachdb.node.list",upstream:"list_cluster_nodes",risk:"READ",purpose:"List cluster nodes, locality and liveness."},
 {external:"cockroachdb.query.running.list",upstream:"show_running_queries",risk:"READ",purpose:"Inspect currently executing statements."},
 {external:"cockroachdb.query.select",upstream:"select_query",risk:"READ",purpose:"Execute a provider-enforced read-only SELECT query."},
 {external:"cockroachdb.query.explain",upstream:"explain_query",risk:"READ",purpose:"Return an EXPLAIN plan without EXPLAIN ANALYZE execution."},
 {external:"cockroachdb.statement.show",upstream:"show_statement",risk:"READ",purpose:"Run supported SHOW statements for metadata and status."},
 {external:"cockroachdb.database.create",upstream:"create_database",risk:"WRITE",purpose:"Create a database after explicit human approval."},
 {external:"cockroachdb.table.create",upstream:"create_table",risk:"WRITE",purpose:"Create one table after explicit human approval."},
 {external:"cockroachdb.row.insert",upstream:"insert_rows",risk:"WRITE",purpose:"Insert rows after explicit human approval."},
 {external:"cockroachdb.row.update",upstream:"update_rows",risk:"HIGH_RISK",purpose:"Update rows with upstream WHERE-clause enforcement and explicit approval."}
] as const;
export const ROUTE_BY_EXTERNAL=new Map(TOOL_ROUTES.map(x=>[x.external,x]));
