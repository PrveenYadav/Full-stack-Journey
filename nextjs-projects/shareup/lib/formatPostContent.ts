import DOMPurify from "dompurify"; // sanitize html texts and prevents from hackers, like if someone also writes script with html then it filtered out script only keeps html

export function formatPostContent(content: string) {
  if (!content) return "";

  let formatted = content;

  // hashtags
  formatted = formatted.replace(
    /#(\w+)/g,
    `<a href="/hashtag/$1" class="text-blue-500 hover:underline">#$1</a>`
  );

  // mentions
  formatted = formatted.replace(
    /@(\w+)/g,
    `<a href="/profile/$1" class="text-blue-500 hover:underline">@$1</a>`
  );

  return DOMPurify.sanitize(formatted);
}