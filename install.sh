#!/usr/bin/env bash

trap "kill 0" EXIT

(cd editor && bun i) &
(cd hub && bun i)

wait
