"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Switch } from "@radix-ui/react-switch"


export function ModeToggle() {
  const { setTheme, theme } = useTheme()
  console.log(theme)

  return (
    <>
    <Switch onClick={(themes) => setTheme("")}/>
    </>
  )
}
