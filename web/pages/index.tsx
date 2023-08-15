import React, { useState } from 'react'
import { Inter } from 'next/font/google'
import { createUser, updateUser } from '../client/apiClient'

const inter = Inter({ subsets: ['latin'] })

const ACTION_TYPE = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
}

export default function Home() {
  const [createInputName, setCreateInputName] = useState('')
  const [createInputEmail, setCreateInputEmail] = useState('')
  const [createInputUsername, setCreateInputUsername] = useState('')
  const [createInputDob, setCreateInputDob] = useState('')

  const [updateInputId, setUpdateInputId] = useState('')

  const [actionType, setActionType] = useState(ACTION_TYPE.CREATE)

  const [response, setResponse] = useState(null)

  const submitAction = () => {
    switch (actionType) {
      case ACTION_TYPE.CREATE:
        console.log('submitting create')
        submitCreateUser()
        break
      case ACTION_TYPE.UPDATE:
        submitUpdateUser()
        break
    }
  }

  const submitCreateUser = async () => {
    const res = await createUser({
      username: createInputUsername,
      fullName: createInputName,
      email: createInputEmail,
      dateOfBirth: createInputDob,
    })

    setResponse(res.data ? res.data : res)
  }

  const submitUpdateUser = async () => {
    const res = await updateUser(updateInputId, {
      username: createInputUsername,
      fullName: createInputName,
      email: createInputEmail,
      dateOfBirth: createInputDob,
    })

    setResponse(res.data ? res.data : res)
  }

  const toggleAction = () => {
    if (actionType == ACTION_TYPE.CREATE) {
      setActionType(ACTION_TYPE.UPDATE)
    }

    if (actionType == ACTION_TYPE.UPDATE) {
      setActionType(ACTION_TYPE.CREATE)
    }
  }

  return (
    <main className={`flex min-h-screen flex-col justify-between px-12 ${inter.className}`}>
      <section className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <span>
            <h1 className="text-lg font-bold">
              {actionType == ACTION_TYPE.CREATE ? 'Create' : 'Update'} User{' '}
            </h1>
            <span className="text-indigo-700 underline cursor-pointer" onClick={toggleAction}>
              or {actionType == ACTION_TYPE.CREATE ? 'Update' : 'Create'} user
            </span>
          </span>
          <div className={'flex flex-col'}>
            {actionType == ACTION_TYPE.UPDATE && (
              <>
                <label htmlFor="updateId" className="mb-1">
                  Id:
                </label>
                <input
                  type="text"
                  id="updateId"
                  required
                  className="border-2 mb-2 py-2 pl-2 rounded-md"
                  onChange={(e) => setUpdateInputId(e.target.value)}
                />
              </>
            )}
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
            <button className="bg-emerald-100 p-4 rounded-md mt-4" onClick={submitAction}>
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
