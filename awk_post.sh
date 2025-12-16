#!/bin/bash

# Get current local time for filename
current_time_local=$(date +"%Y-%m-%d-%H-%M")

# Get current local time for front matter
current_time_local_iso=$(date +"%Y-%m-%d %H:%M:%S+7")

# Copy template and replace line 3 with current date
awk -v date="$current_time_local_iso" 'NR==3{$0="date: " date}1' posts/post.txt > posts/${current_time_local}.md