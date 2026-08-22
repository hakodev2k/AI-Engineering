#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path
import xml.etree.ElementTree as ET

def fail(msg, code=2):
    print(msg, file=sys.stderr); raise SystemExit(code)

def fnum(v):
    try: return float(v)
    except (TypeError, ValueError): return None

def parse_postgres(path):
    data=json.loads(Path(path).read_text(encoding='utf-8'))
    root=data[0]['Plan'] if isinstance(data,list) else data['Plan']
    scans=[]; max_rows=0.0
    def walk(n):
        nonlocal max_rows
        typ=str(n.get('Node Type',''))
        rel=n.get('Relation Name')
        if 'Seq Scan' in typ: scans.append(rel or '<unknown>')
        rows=fnum(n.get('Actual Rows', n.get('Plan Rows')))
        if rows is not None: max_rows=max(max_rows,rows)
        for c in n.get('Plans',[]): walk(c)
    walk(root)
    cost=fnum(root.get('Total Cost')) or 0.0
    actual=fnum(root.get('Actual Total Time'))
    return {'engine':'postgres','cost':cost,'actual_time_ms':actual,'max_rows':max_rows,'seq_scans':sorted(set(scans))}

def parse_sqlserver(path):
    root=ET.parse(path).getroot(); cost=0.0; max_rows=0.0; scans=[]
    for e in root.iter():
        tag=e.tag.split('}')[-1]
        if tag=='StmtSimple': cost=max(cost,fnum(e.attrib.get('StatementSubTreeCost')) or 0.0)
        if tag=='RelOp':
            max_rows=max(max_rows,fnum(e.attrib.get('EstimateRows')) or 0.0)
            phys=e.attrib.get('PhysicalOp','')
            if phys in ('Table Scan','Clustered Index Scan','Index Scan'): scans.append(phys)
    return {'engine':'sqlserver','cost':cost,'actual_time_ms':None,'max_rows':max_rows,'seq_scans':sorted(set(scans))}

def parse(path):
    p=Path(path)
    if not p.is_file(): fail(f'plan not found: {path}')
    try:
        if p.suffix.lower() in ('.sqlplan','.xml'): return parse_sqlserver(path)
        return parse_postgres(path)
    except (KeyError, json.JSONDecodeError, ET.ParseError, OSError) as e: fail(f'invalid plan {path}: {e}')

def ratio(a,b):
    if b<=0: return 1.0 if a<=0 else float('inf')
    return a/b

def main():
    ap=argparse.ArgumentParser(description='Fail on material PostgreSQL/SQL Server plan regression.')
    ap.add_argument('--baseline',required=True); ap.add_argument('--candidate',required=True); ap.add_argument('--output',required=True)
    ap.add_argument('--max-cost-ratio',type=float,default=1.30); ap.add_argument('--max-row-ratio',type=float,default=2.0)
    ap.add_argument('--forbid-new-seq-scan',action='store_true')
    a=ap.parse_args()
    if a.max_cost_ratio < 1 or a.max_row_ratio < 1: fail('ratios must be >= 1')
    b,c=parse(a.baseline),parse(a.candidate)
    if b['engine']!=c['engine']: fail('baseline and candidate engines differ')
    findings=[]
    cr=ratio(c['cost'],b['cost']); rr=ratio(c['max_rows'],b['max_rows'])
    if cr>a.max_cost_ratio: findings.append({'code':'cost-regression','severity':'blocking','ratio':cr})
    if rr>a.max_row_ratio: findings.append({'code':'row-regression','severity':'blocking','ratio':rr})
    new_scans=sorted(set(c['seq_scans'])-set(b['seq_scans']))
    if a.forbid_new_seq_scan and new_scans: findings.append({'code':'new-scan','severity':'blocking','items':new_scans})
    report={'status':'fail' if findings else 'pass','engine':b['engine'],'baseline':b,'candidate':c,'metrics':{'cost_ratio':cr,'row_ratio':rr,'new_scans':new_scans},'findings':findings}
    Path(a.output).write_text(json.dumps(report,indent=2,sort_keys=True),encoding='utf-8')
    print(json.dumps(report,indent=2,sort_keys=True))
    return 1 if findings else 0

if __name__=='__main__': raise SystemExit(main())
