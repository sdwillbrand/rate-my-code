/* eslint-disable @typescript-eslint/no-empty-function */
import { type PostSnippet } from "@/utils/typings";
import Prism from "prismjs";
import "prismjs/components";
import "prismjs/themes/prism-okaidia.min.css";
import Editor from "react-simple-code-editor";

interface Props {
  snippet: PostSnippet;
}

const ViewEditor = ({ snippet }: Props) => {
  return (
    <div key={snippet.id} className="min-w-60 rounded-lg border border-solid">
      <h1 className="text-xl">{snippet.title}</h1>
      <Editor
        onValueChange={() => {}}
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
    </div>
  );
};

export default ViewEditor;
