"use client";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { PROGRAMMING_LANGUAGES } from "@/utils/ProgrammingLanguages";
import { type PostSnippet } from "@/utils/typings";
import Prism from "prismjs";
import "prismjs/components";
import "prismjs/themes/prism-okaidia.min.css";
import Editor from "react-simple-code-editor";

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

  const language = useWatch({ control, name: "language" });

  const onSubmit = (data: PostSnippet) => {
    createPost.mutate(data);
  };

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
      <Controller
        control={control}
        name="code"
        render={({ field }) => (
          <Editor
            value={field.value}
            onValueChange={(code) => field.onChange(code)}
            textareaClassName="bg-black"
            className="bg-black"
            highlight={(code) => {
              return Prism.highlight(
                code,
                Prism.languages[language] ?? Prism.languages.js!,
                language,
              );
            }}
            padding={10}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 14,
            }}
          />
        )}
      />
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
