import os
import re

history_file = "/home/jules/.bash_history"
if os.path.exists(history_file):
    with open(history_file, 'r') as f:
        print("BASH HISTORY:")
        print(f.read()[-1000:])
