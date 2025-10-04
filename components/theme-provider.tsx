'use client'

//i am getting tired of u looking at my code

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}