import React, { useState } from 'react'
import { Inter } from 'next/font/google'
import { getUserById } from '../client/apiClient'

const inter = Inter({ subsets: ['latin'] })

export default function User() {
  const [userId, setUserId] = useState('')

  const [response, setResponse] = useState(null)

  const submitCreateUser = async () => {
    const res = await getUserById(userId)

    setResponse(res.data ? res.data : res)
  }

  return (
    <main className={`flex min-h-screen flex-col justify-between px-12 ${inter.className}`}>
      <section className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <h1 className="text-lg font-bold">Get User</h1>
          <div className={'flex flex-col'}>
            <label htmlFor="fetchedId" className="mb-1">
              Id:
            </label>
            <input
              type="text"
              id="fetchedId"
              required
              className="border-2 mb-2 py-2 pl-2 rounded-md"
              onChange={(e) => setUserId(e.target.value)}
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
