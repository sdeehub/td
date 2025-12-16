#!/bin/bash

# Get current local time for filename
current_time_local=$(date +"%Y-%m-%d-%H-%M")

# Get current local time for front matter
current_time_local_iso=$(date +"%Y-%m-%d %H:%M:%S+7")

# Copy template and replace line 3 with current date
cp posts/post.txt posts/${current_time_local}.md
sed -i '3s/$/ '"${current_time_local_iso}"'/' posts/"${current_time_local}".md