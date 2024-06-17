"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Search } from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";

const FormSchema = z.object({
  input: z.string().min(2, {
    message: "The word must be at least 2 characters long.",
  }),
});

export type Root = Root2[];

export interface Root2 {
  word: string;
  phonetic: string;
  phonetics: Phonetic[];
  meanings: Meaning[];
  license: License2;
  sourceUrls: string[];
}

export interface Phonetic {
  text: string;
  audio: string;
  sourceUrl?: string;
  license?: License;
}

export interface License {
  name: string;
  url: string;
}

export interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
  synonyms: string[];
  antonyms: any[];
}

export interface Definition {
  definition: string;
  synonyms: any[];
  antonyms: any[];
  example?: string;
}

export interface License2 {
  name: string;
  url: string;
}

export function HeroSection() {
  const [word, setWord] = useState<string>("");
  const [typeOfWord, setTypeOfWord] = useState("");
  const [synonym, setSynonym] = useState<string[]>([]);
  const [meanings, setMeanings] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      input: "",
    },
  });

  const onSubmit = async (data: { input: string }) => {
    setError(null); // Reset error before making a new request
    try {
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${data.input}`
      );

      if (!res.ok) {
        throw new Error("Invalid word or search area empty");
      }

      const dataRes: Root = await res.json();

      if (!dataRes || dataRes.length === 0) {
        setError("Invalid word or search area empty");
        setWord("");
        setTypeOfWord("");
        setSynonym([]);
        setMeanings([]);
        return;
      }

      const uniqueWords = Array.from(new Set(dataRes.map((x) => x.word)));
      const uniqueMeanings = Array.from(
        new Set(
          dataRes.flatMap((x) =>
            x.meanings.flatMap((meaning) =>
              meaning.definitions.slice(0, 2).map((def) => def.definition)
            )
          )
        )
      );
      const uniqueSynonyms = Array.from(
        new Set(
          dataRes.flatMap((x) =>
            x.meanings.flatMap((meaning) => meaning.synonyms.slice(0, 2))
          )
        )
      );

      setWord(uniqueWords.join(", "));
      setTypeOfWord(dataRes[0].meanings[0].partOfSpeech);
      setMeanings(uniqueMeanings);
      setSynonym(uniqueSynonyms);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Invalid word or search area empty");
      setWord("");
      setTypeOfWord("");
      setSynonym([]);
      setMeanings([]);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-12">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative w-full max-w-lg mb-8"
      >
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Ex: Mouse"
            {...form.register("input")}
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 w-full pr-12"
          />
          <button
            type="submit"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            <Search size={20} className="text-gray-400" />
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="flex flex-col items-start w-full max-w-4xl mt-12">
        <h1 className="text-4xl font-semibold text-black-500">{word}</h1>
        <hr className="w-full border-gray-300 my-4" />
        <div className="flex items-center mt-2">
          <hr className="flex-grow border-gray-300 mr-4" />
          <p className={`text-2xl ${theme === "dark" ? "text-white" : "text-black"}`}>
            {typeOfWord}
          </p>
        </div>
        <div className="mt-4 w-full">
          <h2 className="text-neutral-500 text-2xl">
            {!typeOfWord ? "" : "Meanings"}
          </h2>
          <ul className="list-disc ml-3 marker:text-purple-500">
            {meanings.map((meaning, index) => (
              <li
                key={index}
                className={`${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                {meaning}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4 w-full flex gap-3">
          <h2 className="text-neutral-500">
            {!typeOfWord ? "" : "Synonyms"}
          </h2>
          <div className="flex flex-wrap gap-4">
            {synonym.map((syn, index) => (
              <span key={index} className="text-purple-500">
                {syn}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
