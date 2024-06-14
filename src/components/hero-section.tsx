"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { symbol, z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Search } from "lucide-react"

const FormSchema = z.object({
  input: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})

export type Root = Root2[]

export interface Root2 {
  word: string
  phonetic: string
  phonetics: Phonetic[]
  meanings: Meaning[]
  license: License2
  sourceUrls: string[]
}

export interface Phonetic {
  text: string
  audio: string
  sourceUrl?: string
  license?: License
}

export interface License {
  name: string
  url: string
}

export interface Meaning {
  partOfSpeech: string
  definitions: Definition[]
  synonyms: string[]
  antonyms: any[]
}

export interface Definition {
  definition: string
  synonyms: any[]
  antonyms: any[]
  example?: string
}

export interface License2 {
  name: string
  url: string
}


export function HeroSection() {
    const [value, setValue] = useState<any>([])
    const [word, setWord] = useState<string[]>([])
    const [typeOfWord, setTypeOfWord] = useState("")
    const [synonym, setSynonym] = useState<string[][][]>([])
    const [meanings, setMeanings] = useState<string[][][]>([])

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      input: "",
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
        const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${data.input}`)
        setValue(res)
        const dataRes: Root = await res.json()
        setWord(dataRes.map((x) => x.word))
        setTypeOfWord(dataRes[0].meanings[0].partOfSpeech)
        setSynonym(dataRes.map((x) => x.meanings.map((x) => x.synonyms.slice(0, 3))))
        setMeanings(dataRes.map((x) => x.meanings.map((x)  => x.definitions.slice(0, 2).map((x) => x.definition))))


    } catch(err){
        console.log(err)
        
    }
  }

  return (
    <div className="flex w-full h-full  flex-col gap-24">

    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-3/3 space-y-6 flex justify-center items-center flex-col">
        <FormField
          control={form.control}
          name="input"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Palavra que deseja buscar</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Mouse" {...field} />
              </FormControl>
              <FormDescription>
               Essa é a palavra que você vai buscar
              
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
    <Button variant="outline" size="icon">
      <Search className="h-4 w-4" />
    </Button>
      </form>
    </Form>
    <div className="flex-col w-full h-full mx-44">
    <h1 className="text-4xl font-semibold text-black-500 mt-[-2.875rem]">{word}</h1>
    <p>{typeOfWord}</p>
    <ul>
    <h1 className="text-neutral-500">{!typeOfWord?(''):("Meanigs")}</h1>
          {meanings.map((meaningGroup, index) => (
            <li key={index}>
              {meaningGroup.map((meaning, subIndex) => (
                <ul key={subIndex} className="list-disc list-inside">
                  {meaning.map((definition, defIndex) => (
                    <li key={defIndex}>{definition}</li>
                  ))}
                </ul>
              ))}
            </li>
          ))}
        </ul>
    <div className="flex gap-4 flex-wrap">
    <h1 className="text-neutral-500  " >{!typeOfWord?(''):("Synonyms")}</h1>
          {synonym.map((synGroup, index) => (
            <div key={index} className="flex gap-4 flex-wrap">
              {synGroup.flat().map((syn, synIndex) => (
                <span key={synIndex} className="text-purple-500">{syn}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}