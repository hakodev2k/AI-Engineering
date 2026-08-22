#!/usr/bin/env python3
import argparse,hashlib,json,sys
from pathlib import Path

def canon(x):
 return json.dumps(x,sort_keys=True,separators=(',',':'),ensure_ascii=False)
def h(x):
 return hashlib.sha256(canon(x).encode()).hexdigest()
def main():
 p=argparse.ArgumentParser();p.add_argument('record',type=Path);a=p.parse_args()
 try:r=json.loads(a.record.read_text())
 except Exception as e: print(json.dumps({'decision':'invalid','error':str(e)}));return 2
 req=['server_instance','tool','call_id','dispatch_generation','dispatch_output_schema','validation_generation','validation_output_schema']
 miss=[k for k in req if k not in r]
 if miss: print(json.dumps({'decision':'invalid','missing':miss}));return 2
 dh=h(r['dispatch_output_schema']);vh=h(r['validation_output_schema'])
 problems=[]
 if r['dispatch_generation']!=r['validation_generation']:problems.append('generation_changed_in_flight')
 if dh!=vh:problems.append('schema_hash_changed_in_flight')
 out={'decision':'deny' if problems else 'allow','problems':problems,'call_id':r['call_id'],'dispatch_generation':r['dispatch_generation'],'validation_generation':r['validation_generation'],'dispatch_schema_sha256':dh,'validation_schema_sha256':vh}
 print(json.dumps(out,indent=2));return 5 if problems else 0
if __name__=='__main__':raise SystemExit(main())
