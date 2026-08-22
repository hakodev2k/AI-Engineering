#!/usr/bin/env python3
import argparse,json,sys
from pathlib import Path

def main():
 p=argparse.ArgumentParser();p.add_argument('report');p.add_argument('--allow-review',action='store_true');a=p.parse_args()
 try:d=json.loads(Path(a.report).read_text(encoding='utf-8'))
 except Exception as e:print(f'invalid report: {e}',file=sys.stderr);return 3
 if not isinstance(d.get('findings'),list) or d.get('status') not in ('pass','fail'):print('invalid report contract',file=sys.stderr);return 3
 high=[x for x in d['findings'] if x.get('severity')=='high']; review=[x for x in d['findings'] if x.get('severity')=='review']
 print(json.dumps({'high':len(high),'review':len(review),'verified':not high and (a.allow_review or not review)}))
 return 2 if high or (review and not a.allow_review) else 0
if __name__=='__main__':sys.exit(main())