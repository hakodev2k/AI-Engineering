#!/usr/bin/env python3
import argparse, json, re, sys
from pathlib import Path
try:
    import yaml
except ImportError:
    print(json.dumps({'status':'error','error':'PyYAML is required: pip install pyyaml'})); sys.exit(3)

def strip_literals(sql):
    sql=re.sub(r"'(?:''|[^'])*'", "''", sql, flags=re.S)
    sql=re.sub(r'"(?:""|[^"])*"', '""', sql, flags=re.S)
    return sql

def split_statements(sql):
    out=[]; buf=[]; quote=None; i=0
    while i<len(sql):
        c=sql[i]
        if quote:
            buf.append(c)
            if c==quote:
                if i+1<len(sql) and sql[i+1]==quote: buf.append(sql[i+1]); i+=1
                else: quote=None
        elif c in "'\"": quote=c; buf.append(c)
        elif c==';':
            if ''.join(buf).strip(): out.append(''.join(buf).strip())
            buf=[]
        else: buf.append(c)
        i+=1
    if ''.join(buf).strip(): out.append(''.join(buf).strip())
    return out

def classify(stmt):
    clean=re.sub(r'^\s*(?:--[^\n]*\n|/\*.*?\*/\s*)*','',stmt,flags=re.S).lower()
    m=re.match(r'([a-z]+)',clean)
    return m.group(1) if m else 'unknown'

def main():
    p=argparse.ArgumentParser(description='Static safety gate for agent-generated SQL; never executes SQL.')
    p.add_argument('--sql-file',required=True); p.add_argument('--policy',required=True); p.add_argument('--environment'); p.add_argument('--output')
    a=p.parse_args()
    try: sql=Path(a.sql_file).read_text(encoding='utf-8'); policy=yaml.safe_load(Path(a.policy).read_text(encoding='utf-8')) or {}
    except Exception as e: print(json.dumps({'status':'error','error':str(e)})); return 3
    env=(a.environment or policy.get('environment','development')).lower()
    findings=[]; approvals=[]
    if len(sql)>int(policy.get('max_query_length',20000)): findings.append({'code':'SQL_TOO_LARGE','severity':'block','evidence':len(sql)})
    stmts=split_statements(sql)
    if len(stmts)>int(policy.get('max_statements',10)): findings.append({'code':'TOO_MANY_STATEMENTS','severity':'block','evidence':len(stmts)})
    if policy.get('forbid_comment_directives',True) and re.search(r'/\*\+|--\s*(?:pragma|set|exec|execute)\b',sql,re.I): findings.append({'code':'DIRECTIVE_COMMENT','severity':'block'})
    prod=env in [x.lower() for x in policy.get('production_environment_names',['production','prod','live'])]
    blocked=[x.lower() for x in policy.get('block_keywords',[])]
    approval=[x.lower() for x in policy.get('require_approval_keywords',[])]
    require_where=[x.lower() for x in policy.get('require_where_for',['update','delete'])]
    for idx,s in enumerate(stmts,1):
        kind=classify(s); normalized=strip_literals(s).lower()
        if kind=='unknown': findings.append({'code':'UNKNOWN_STATEMENT','severity':'block','statement':idx})
        for kw in blocked:
            if re.search(r'(?<![a-z0-9_])'+re.escape(kw)+r'(?![a-z0-9_])',normalized): findings.append({'code':'BLOCKED_KEYWORD','severity':'block','statement':idx,'evidence':kw})
        if kind in require_where and not re.search(r'\bwhere\b',normalized): findings.append({'code':'MISSING_WHERE','severity':'block','statement':idx,'evidence':kind})
        if kind in approval: approvals.append({'code':'WRITE_REQUIRES_APPROVAL','statement':idx,'evidence':kind})
        if prod and kind in approval and policy.get('block_production_writes',True): findings.append({'code':'PRODUCTION_WRITE','severity':'block','statement':idx,'evidence':kind})
        for schema in policy.get('blocked_schemas',[]):
            if re.search(r'(?<![a-z0-9_])'+re.escape(schema.lower())+r'\s*\.',normalized): findings.append({'code':'BLOCKED_SCHEMA','severity':'block','statement':idx,'evidence':schema})
        allowed=policy.get('allowed_schemas',[])
        if allowed:
            refs=re.findall(r'\b(?:from|join|update|into|delete\s+from)\s+([a-zA-Z_][\w$]*)\.',normalized)
            for schema in refs:
                if schema.lower() not in [x.lower() for x in allowed]: findings.append({'code':'SCHEMA_NOT_ALLOWED','severity':'block','statement':idx,'evidence':schema})
    if findings: status='blocked'
    elif approvals: status='approval_required'
    else: status='passed'
    result={'status':status,'environment':env,'statement_count':len(stmts),'findings':findings,'approvals':approvals,'executed':False}
    text=json.dumps(result,indent=2)
    if a.output: Path(a.output).write_text(text+'\n',encoding='utf-8')
    print(text)
    return 2 if status=='blocked' else 4 if status=='approval_required' else 0
if __name__=='__main__': sys.exit(main())
