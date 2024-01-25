import Prism from "prismjs";

interface Props {
  editable: boolean;
  code: string;
  language: string;
}

const CodeFormatter = ({ editable, code, language }: Props) => {
  return (
    <pre className={`language-${language}`}>
      <code className={`language-${language}`}>
        <div
          className="w-full bg-transparent px-4 pt-2 outline-none"
          contentEditable={editable}
          dangerouslySetInnerHTML={{
            __html: Prism.highlight(
              code,
              Prism.languages[language] ?? Prism.languages.javascript!,
              language,
            ),
          }}
        />
      </code>
    </pre>
  );
};

export default CodeFormatter;
