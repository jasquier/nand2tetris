#!/usr/bin/env bash

# Runs all of the *.tst files in a given directory using the hardware simulator.
if [ $# -lt 1 ]; then
  echo
  echo "Usage: ./run-all-tst.sh <project directory>"
  exit 1
fi

directory="$1"

echo "run-all-tst"

ls -1 ./projects/$directory/*.tst | xargs -n 1 ./tools/HardwareSimulator.sh
