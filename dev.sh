#!/usr/bin/env bash

trap "kill 0" EXIT

(cd editor && bun dev) &
(cd hub && bun dev) &
(cd hub && bun dev:convex) &

wait
