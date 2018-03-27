#!/bin/sh

rsync -avczh --delete dist public cmujsa@cmujsa.com:cmujsa.com/ $@

