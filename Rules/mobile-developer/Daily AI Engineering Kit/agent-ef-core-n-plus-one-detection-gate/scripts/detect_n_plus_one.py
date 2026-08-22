#!/usr/bin/env python3
import argparse, json, re, sys
from collections import defaultdict
from pathlib import Path

SQL_START = re.compile(r'\b(SELECT|INSERT|UPDATE|DELETE|WITH)\b', re.I)
NUMBER = re.compile(r'(?<![\w])[-+]?\d+(?:\.\d+)?(?![\w])')
STRING = re.compile(r"N?'(?:''|[^'])*'")
PARAM_VALUE = re.compile(r"(@[A-Za-z0-9_]+)='(?:''|[^'])*'|(@[A-Za-z0-9_]+)=([^,\)]+)")
PARAM_BLOCK = re.compile(r'Parameters=\[(.*?)\]', re.I)

def load_policy(path):
    text = Path(path).read_text(encoding='utf-8')
    result = {}
    current_list = None
    for raw in text.splitlines():
        line = raw.rstrip()
        if not line or line.lstrip().startswith('#'): continue
        if line.startswith('  - ') and current_list:
            result[current_list].append(line[4:].strip().strip("'\"")); continue
        if ':' in line and not line.startswith(' '):
            k,v=line.split(':',1); k=k.strip(); v=v.strip(); current_list=None
            if not v: result[k]=[]; current_list=k
            elif v.lower() in ('true','false'): result[k]=v.lower()=='true'
            elif v.isdigit(): result[k]=int(v)
            else: result[k]=v.strip("'\"")
    return result

def normalize_sql(sql, policy):
    s=' '.join(sql.split())
    if policy.get('normalize_literals', True):
        s=STRING.sub("'?", s)
        s=NUMBER.sub('?', s)
    if policy.get('normalize_parameter_values', True):
        s=PARAM_VALUE.sub(lambda m: (m.group(1) or m.group(2))+'=?', s)
    return s.strip()

def parse_log(text, policy):
    req_re=re.compile(policy.get('request_marker_pattern', r'^REQUEST (?P<request_id>\S+)$'))
    marker=policy.get('command_marker','Executed DbCommand')
    request='global'; rows=[]; lines=text.splitlines(); i=0
    while i < len(lines):
        line=lines[i].strip()
        m=req_re.match(line)
        if m:
            request=m.groupdict().get('request_id') or m.group(1); i+=1; continue
        if marker in line:
            param_match=PARAM_BLOCK.search(line)
            params=param_match.group(1).strip() if param_match else ''
            sql=[]; j=i+1
            while j < len(lines):
                cur=lines[j].strip()
                if req_re.match(cur) or marker in cur: break
                if cur.startswith(policy.get('parameter_line_prefix','Parameters=')):
                    params=cur
                elif SQL_START.search(cur) or sql:
                    sql.append(cur)
                j+=1
            statement=' '.join(sql).strip()
            if statement: rows.append({'request_id':request,'sql':statement,'parameters':params})
            i=j; continue
        i+=1
    return rows

def analyze(rows, policy):
    ignored=[re.compile(p,re.I) for p in policy.get('ignore_sql_patterns',[])]
    groups=defaultdict(list)
    for row in rows:
        norm=normalize_sql(row['sql'], policy)
        if any(p.search(norm) for p in ignored): continue
        groups[(row['request_id'],norm)].append(row)
    suspects=[]
    min_count=int(policy.get('minimum_repeated_query_count',5))
    min_params=int(policy.get('minimum_distinct_parameter_sets',3))
    for (request,norm), items in groups.items():
        parameter_sets={x['parameters'] for x in items if x['parameters']}
        if len(items)>=min_count and len(parameter_sets)>=min_params:
            suspects.append({
                'request_id':request,
                'normalized_sql':norm,
                'query_count':len(items),
                'distinct_parameter_sets':len(parameter_sets),
                'severity':'high' if len(items)>=min_count*2 else 'medium',
                'evidence':items[:5]
            })
    suspects.sort(key=lambda x:(-x['query_count'],x['request_id']))
    return {'status':'fail' if suspects else 'pass','total_commands':len(rows),'suspect_groups':suspects}

def main():
    p=argparse.ArgumentParser(description='Detect likely EF Core N+1 query patterns from command logs.')
    p.add_argument('--log',required=True); p.add_argument('--policy',required=True); p.add_argument('--out',required=True)
    a=p.parse_args()
    try:
        policy=load_policy(a.policy); text=Path(a.log).read_text(encoding='utf-8',errors='replace')
        result=analyze(parse_log(text,policy),policy)
        Path(a.out).parent.mkdir(parents=True,exist_ok=True); Path(a.out).write_text(json.dumps(result,indent=2),encoding='utf-8')
        max_allowed=int(policy.get('maximum_allowed_suspect_groups',0))
        return 2 if len(result['suspect_groups'])>max_allowed else 0
    except Exception as e:
        print(f'error: {e}',file=sys.stderr); return 3
if __name__=='__main__': sys.exit(main())
