import React, { useState } from 'react'
import { Inter } from 'next/font/google'
import { createUser } from '../client/apiClient'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [createInputName, setCreateInputName] = useState('')
  const [createInputEmail, setCreateInputEmail] = useState('')
  const [createInputUsername, setCreateInputUsername] = useState('')
  const [createInputDob, setCreateInputDob] = useState('')

  const [response, setResponse] = useState(null)

  const submitCreateUser = async () => {
    const res = await createUser({
      username: createInputUsername,
      fullName: createInputName,
      email: createInputEmail,
      dateOfBirth: createInputDob,
    })

    setResponse(res.data ? res.data : res)
  }

  return (
    <main className={`flex min-h-screen flex-col justify-between px-12 ${inter.className}`}>
      <section className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <h1 className="text-lg font-bold">Create User</h1>
          <div className={'flex flex-col'}>
            <label htmlFor="createUsername" className="mb-1">
              Username:
            </label>
            <input
              type="text"
              id="createUsername"
              required
              className="border-2 mb-2 py-2 pl-2 rounded-md"
              onChange={(e) => setCreateInputUsername(e.target.value)}
            />
            <label htmlFor="createFullName" className="mb-1">
              Full Name:
            </label>
            <input
              type="text"
              id="createFullName"
              required
              className="border-2 mb-2 py-2 pl-2 rounded-md"
              onChange={(e) => setCreateInputName(e.target.value)}
            />
            <label htmlFor="createEmail" className="mb-1">
              Email:
            </label>
            <input
              type="email"
              id="createEmail"
              required
              className="border-2 mb-2 py-2 pl-2 rounded-md"
              onChange={(e) => setCreateInputEmail(e.target.value)}
            />
            <label htmlFor="createDateOfBirth" className="mb-1">
              Date of Birth:
            </label>
            <input
              type="text"
              id="createDateOfBirth"
              required
              className="border-2 mb-2 py-2 pl-2 rounded-md"
              onChange={(e) => setCreateInputDob(e.target.value)}
            />
            <button className="bg-emerald-100 p-4 rounded-md mt-4" onClick={submitCreateUser}>
              Submit
            </button>
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
