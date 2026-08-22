#!/usr/bin/env python3
"""Read-only Linux inotify budget profiler."""
import argparse, json, pathlib, sys

def read_int(path):
    return int(pathlib.Path(path).read_text().strip())

def count_pid(pid, proc_root):
    fdinfo = pathlib.Path(proc_root) / str(pid) / 'fdinfo'
    watches = 0; instances = 0
    if not fdinfo.is_dir():
        raise FileNotFoundError(f'pid {pid} fdinfo unavailable')
    for p in fdinfo.iterdir():
        try:
            text = p.read_text(errors='ignore')
        except (OSError, PermissionError):
            continue
        n = sum(1 for line in text.splitlines() if line.startswith('inotify wd:'))
        if n:
            instances += 1; watches += n
    return watches, instances

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--pid', type=int, required=True)
    ap.add_argument('--proc-root', default='/proc')
    ap.add_argument('--warn', type=float, default=.80)
    ap.add_argument('--block', type=float, default=.90)
    ap.add_argument('--max-watches', type=int)
    ap.add_argument('--max-instances', type=int)
    a = ap.parse_args()
    if a.pid <= 0 or not (0 < a.warn < a.block <= 1):
        print('invalid arguments', file=sys.stderr); return 2
    try:
        base = pathlib.Path(a.proc_root)
        mw = a.max_watches or read_int(base/'sys/fs/inotify/max_user_watches')
        mi = a.max_instances or read_int(base/'sys/fs/inotify/max_user_instances')
        watches, instances = count_pid(a.pid, a.proc_root)
    except Exception as e:
        print(f'measurement failed: {e}', file=sys.stderr); return 2
    wu = watches / mw if mw else 1.0; iu = instances / mi if mi else 1.0
    util = max(wu, iu)
    status = 'BLOCK' if util >= a.block else ('WARN' if util >= a.warn else 'PASS')
    print(json.dumps({'pid':a.pid,'watches':watches,'instances':instances,'max_user_watches':mw,'max_user_instances':mi,'watch_utilization':round(wu,6),'instance_utilization':round(iu,6),'status':status}, indent=2))
    return 3 if status == 'BLOCK' else (1 if status == 'WARN' else 0)

if __name__ == '__main__':
    raise SystemExit(main())
