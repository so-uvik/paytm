"use client"

import { signIn } from "next-auth/react"

export default function Home() {
  return <button onClick={() => signIn()}>Sign in</button>
} 