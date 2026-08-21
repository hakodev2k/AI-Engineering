#!/usr/bin/env python3
import argparse, pathlib, re, sys

PATTERNS = [
    (3, r'OrderBy\s*\([^)]*(Timestamp|CreatedAt|DateTime)', 'timestamp-only ordering'),
    (4, r'(Consume|Handle|Process).*async', 'message consumer/handler path'),
    (5, r'(Parallel\.ForEach|Task\.WhenAll|MaxConcurrent|Concurrency)', 'parallel processing may reorder messages'),
    (5, r'(Version|Sequence|Offset|ETag)\s*[<>=]', 'sequence/version logic present; verify stale rejection'),
    (4, r'(Idempot|Dedup|Duplicate|MessageId)', 'duplicate handling present; verify persistence scope'),
    (5, r'(Retry|Redeliver|Replay)', 'retry/replay path may deliver old or duplicate messages'),
    (6, r'(Update|SaveChanges|ExecuteUpdate).*\n.*(Publish|SendAsync|Produce)', 'state mutation plus publish/send requires ordering boundary review'),
]
EXTS={'.cs','.java','.kt','.ts','.js','.py','.go','.rb'}

def files(root):
    p=pathlib.Path(root)
    if p.is_file(): yield p
    else:
        for f in p.rglob('*'):
            if f.is_file() and f.suffix.lower() in EXTS and not any(x in f.parts for x in ('.git','node_modules','bin','obj')): yield f

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('path', nargs='?', default='.'); ap.add_argument('--block-score',type=int,default=6); args=ap.parse_args()
    findings=[]
    for f in files(args.path):
        try: text=f.read_text(errors='ignore')
        except OSError: continue
        for score,pat,label in PATTERNS:
            if re.search(pat,text,re.I|re.S): findings.append((score,str(f),label))
    findings.sort(reverse=True)
    for s,f,l in findings: print(f'{s}\t{f}\t{l}')
    if any(s>=args.block_score for s,_,_ in findings): return 2
    return 1 if findings else 0
if __name__=='__main__': sys.exit(main())
