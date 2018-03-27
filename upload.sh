#!/bin/sh

SITE=cmujsa.com

USER=cmujsa
HOST=cmujsa.com

echo "--- UPLOADING TO '$SITE' ---"
echo -n "Last chance to abort (did you remember to 'npm run dist'?) [y/N] "
read yn
case "$yn" in
    [Yy]*)
        ;;
    *)
        echo "Abort."
        exit 1
        ;;
esac
unset yn

rsync -avczh --delete dist public $USER@$HOST:$SITE/ $@

