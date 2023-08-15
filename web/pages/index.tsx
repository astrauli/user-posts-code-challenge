import React, { useState } from 'react'
import { Inter } from 'next/font/google'
import { createUser, updateUser, getUserById, deleteUser } from '../client/apiClient'

const inter = Inter({ subsets: ['latin'] })

enum ACTION_TYPE {
  CREATE,
  UPDATE,
  GET,
  DELETE,
}

export default function Home() {
  const [createInputName, setCreateInputName] = useState('')
  const [createInputEmail, setCreateInputEmail] = useState('')
  const [createInputUsername, setCreateInputUsername] = useState('')
  const [createInputDob, setCreateInputDob] = useState('')

  const [inputId, setInputId] = useState('')

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
      case ACTION_TYPE.GET:
        submitGetUser()
        break
      case ACTION_TYPE.DELETE:
        submitDeleteUser()
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

  const submitGetUser = async () => {
    const res = await getUserById(inputId)

    setResponse(res.data ? res.data : res)
  }

  const submitUpdateUser = async () => {
    const res = await updateUser(inputId, {
      username: createInputUsername,
      fullName: createInputName,
      email: createInputEmail,
      dateOfBirth: createInputDob,
    })

    setResponse(res.data ? res.data : res)
  }

  const submitDeleteUser = async () => {
    const res = await deleteUser(inputId)

    setResponse(res.data ? res.data : res)
  }

  const renderIdInput = () => {
    return (
      actionType == ACTION_TYPE.UPDATE ||
      actionType == ACTION_TYPE.GET ||
      actionType == ACTION_TYPE.DELETE
    )
  }

  const renderNonIdFields = () => {
    return actionType == ACTION_TYPE.CREATE || actionType == ACTION_TYPE.UPDATE
  }

  const toggleAction = (action: ACTION_TYPE) => {
    clearInput()

    setActionType(action)
  }

  const clearInput = () => {
    setCreateInputName('')
    setCreateInputEmail('')
    setCreateInputUsername('')
    setCreateInputDob('')

    setInputId('')
  }

  return (
    <main className={`flex min-h-screen flex-col justify-between px-12 ${inter.className}`}>
      <section className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <span>
            <h1 className="text-lg font-bold">{ACTION_TYPE[actionType]} User </h1>
            <p
              className="text-indigo-700 underline cursor-pointer"
              onClick={() => toggleAction(ACTION_TYPE.UPDATE)}
            >
              or update user
            </p>
            <p
              className="text-indigo-700 underline cursor-pointer"
              onClick={() => toggleAction(ACTION_TYPE.CREATE)}
            >
              or create user
            </p>
            <p
              className="text-indigo-700 underline cursor-pointer"
              onClick={() => toggleAction(ACTION_TYPE.GET)}
            >
              or get user
            </p>
            <p
              className="text-indigo-700 underline cursor-pointer"
              onClick={() => toggleAction(ACTION_TYPE.DELETE)}
            >
              or delete user
            </p>
          </span>
          <div className={'flex flex-col'}>
            {renderIdInput() && (
              <>
                <label htmlFor="updateId" className="mb-1">
                  Id:
                </label>
                <input
                  type="text"
                  id="updateId"
                  required
                  className="border-2 mb-2 py-2 pl-2 rounded-md"
                  onChange={(e) => setInputId(e.target.value)}
                />
              </>
            )}
            {renderNonIdFields() && (
              <>
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
              </>
            )}

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
