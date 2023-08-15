import React, { useState } from 'react'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import { signup } from '../client/apiClient'

const inter = Inter({ subsets: ['latin'] })

export default function Signup() {
  const [inputUsername, setInputUsername] = useState('')
  const [inputPassword, setInputPassword] = useState('')

  const [response, setResponse] = useState<any>(null)

  const submitSignup = async () => {
    const res = await signup(inputUsername, inputPassword)

    setResponse(res)
  }

  return (
    <main className={`flex min-h-screen flex-col justify-between px-12 ${inter.className}`}>
      <section className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <span>
            <h1 className="text-lg font-bold">Signup</h1>
          </span>
          <div className={'flex flex-col'}>
            <label htmlFor="inputUsername" className="mb-1">
              Username:
            </label>
            <input
              type="text"
              id="inputUsername"
              required
              value={inputUsername}
              className="border-2 mb-2 py-2 pl-2 rounded-md"
              onChange={(e) => setInputUsername(e.target.value)}
            />

            <label htmlFor="inputPassword" className="mb-1">
              Password:
            </label>
            <input
              type="text"
              id="inputPassword"
              required
              value={inputPassword}
              className="border-2 mb-2 py-2 pl-2 rounded-md"
              onChange={(e) => setInputPassword(e.target.value)}
            />

            <button className="bg-emerald-100 p-4 rounded-md mt-4" onClick={submitSignup}>
              Submit
            </button>
          </div>

          <div className="text-indigo-700 underline cursor-pointer mt-4">
            <Link href="/">Go to users</Link>
          </div>
          <div className="text-indigo-700 underline cursor-pointer mt-4">
            <Link href="/posts">Go to posts</Link>
          </div>
          <div className="text-indigo-700 underline cursor-pointer mt-4">
            <Link href="/login">Go to login</Link>
          </div>
        </div>

        <div className="col-span-2">
          <h1 className="text-lg font-bold">Output</h1>
          {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
        </div>
      </section>
    </main>
  )
}
