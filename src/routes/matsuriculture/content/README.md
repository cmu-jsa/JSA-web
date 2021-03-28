# Event content

If an event needs a content page, a markdown file can be placed here and its
path (relative to this directory) can be added to `../events.csv`. For example,
if the content file is called `my-content.md`:

```
title,startDate,endDate,location,contentPath
My event title,2000-01-01,2000-01-01,My location,my-content.md
```

If an event should link directly to an absolute path, put the path with a
leading `/` as the `contentPath`:

```
title,startDate,endDate,location,contentPath
My event title,2000-01-01,2000-01-01,My location,/my-link/foo
```

