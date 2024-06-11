"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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

const FormSchema = z.object({
  input: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})

export function HeroSection() {
    const [value, setValue] = useState<any>([])
    const [word, setWord] = useState("")
    const [typeOfWord, setTypeOfWord] = useState("")

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
        const dataRes = await res.json()
        setWord(dataRes[0].word)
        setTypeOfWord(dataRes[0].meanings[1].partOfSpeech)
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
        <Button type="submit">Buscar</Button>
      </form>
    </Form>
    <div className="flex w-full h-full mx-44">
    <h1 className="text-4xl font-semibold text-purple-500">{word}</h1>
    <p>{typeOfWord}</p>
    </div>
    </div>
  )
}
