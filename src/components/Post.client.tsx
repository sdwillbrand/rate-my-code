import { api } from "@/trpc/react";
import type { PostSnippet } from "@/utils/typings";
import classNames from "classnames";
import Prism from "prismjs";
import Editor from "react-simple-code-editor";

interface Props {
  snippet: PostSnippet;
}

const Post = ({ snippet }: Props) => {
  if (!snippet.id) return;
  const reaction = api.reaction.getReaction.useQuery({
    snippetId: snippet.id,
    userId: snippet.userId,
  });

  const createReaction = api.reaction.createReation.useMutation({
    onSuccess: () => {
      reaction.refetch().catch(console.error);
    },
  });

  const handleClick = (reaction: "like" | "dislike") => {
    if (!snippet.id) return;
    createReaction.mutate({
      snippetId: snippet.id,
      userId: snippet.userId,
      reaction: reaction,
    });
  };

  return (
    <div className="flex flex-col rounded-lg border">
      <h1 className="p-3 text-xl">{snippet.title}</h1>
      <Editor
        className="bg-black"
        onValueChange={() => {
          return;
        }}
        value={snippet.code}
        disabled
        textareaClassName="bg-black"
        highlight={(code) => {
          return Prism.highlight(
            code,
            Prism.languages[snippet.language] ?? Prism.languages.js!,
            snippet.language,
          );
        }}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 14,
        }}
      />
      <div className="mt-2 flex gap-2 p-3">
        <button
          onClick={() => handleClick("like")}
          className={classNames("h-8 w-8 rounded-lg border", {
            "bg-green-500": reaction.data === "like",
          })}
          disabled={reaction.data === "like"}
        >
          +
        </button>
        <button
          onClick={() => handleClick("dislike")}
          className={classNames("h-8 w-8 rounded-lg border", {
            "bg-orange-500": reaction.data === "dislike",
          })}
          disabled={reaction.data === "dislike"}
        >
          -
        </button>
      </div>
    </div>
  );
};

export default Post;
