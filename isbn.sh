#!/bin/bash

# Check if ISBN number is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <isbn-number>"
  exit 1
fi

# Get the ISBN number from the first argument
isbn_number="$1"

# Get current local time for filename
current_time_local=$(date +"%Y-%m-%d-%H-%M")

# Get current local time for front matter
current_time_local_iso=$(date +"%Y-%m-%d %H:%M:%S+7")

# Copy post template and replace line 3 with current date
cp posts/post.txt posts/${current_time_local}.md
sed -i '3s/$/ '"${current_time_local_iso}"'/' posts/"${current_time_local}".md

# Add the ISBN tag to line 15 of posts/post.txt
sed -i "15i\\ - isbn_${isbn_number}" posts/"${current_time_local}".md

# Copy list template and replace line 3 with isbn_number
if [ ! -e "posts/list_isbn_${isbn_number}.md" ]; then
  cp posts/list_isbn.txt posts/list_isbn_${isbn_number}.md
  sed -i '3s/$/'isbn_"${isbn_number}"'/' posts/list_isbn_"${isbn_number}".md
fi

