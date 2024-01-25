"use client";

import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { useForm, useWatch } from "react-hook-form";
import { PROGRAMMING_LANGUAGES } from "@/utils/ProgrammingLanguages";
import { type PostSnippet } from "@/utils/typings";
import Prism from "prismjs";
import "@/styles/prism-okaidia.min.css";
import { useState } from "react";

interface Props {
  userId: string;
}

const CreateSnippet = ({ userId }: Props) => {
  const router = useRouter();
  const { control, handleSubmit, register } = useForm<PostSnippet>({
    defaultValues: { title: "", code: "", language: "javascript", userId },
  });
  const createPost = api.snippet.create.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const [formattedCode, setFormattedCode] = useState("");

  const language = useWatch({ control, name: "language" });

  const onSubmit = (data: PostSnippet) => {
    createPost.mutate(data);
  };

  const codeMethods = register("code");

  return (
    <div className="flex flex-col gap-2">
      <input
        className="text-black"
        type="text"
        placeholder="Title"
        {...register("title")}
      />
      <select {...register("language")} className="text-black">
        <option value="" disabled>
          Select programming language
        </option>
        {PROGRAMMING_LANGUAGES.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <pre className={`language-${language}`}>
        <code className={`language-${language}`}>
          <div
            className="w-full bg-transparent px-4 py-2 outline-none"
            contentEditable="true"
            {...codeMethods}
            onInput={(e) =>
              setFormattedCode(
                Prism.highlight(
                  e.currentTarget.textContent ?? "",
                  Prism.languages[language] ?? Prism.languages.javascript!,
                  language,
                ),
              )
            }
            dangerouslySetInnerHTML={{ __html: formattedCode }}
          />
        </code>
      </pre>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        disabled={createPost.isLoading}
        onClick={handleSubmit(onSubmit)}
      >
        {createPost.isLoading ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
};

export default CreateSnippet;
