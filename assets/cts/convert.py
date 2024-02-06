import base64
import sys

def convert(name):
    with open(name, 'r') as f:
        d = f.read()
    d = d[d.index(',') + 1:d.rindex('"')]
    d = base64.b64decode(d)
    with open(name, 'wb') as f:
        f.write(d)

if __name__ == "__main__":
    convert(sys.argv[1])