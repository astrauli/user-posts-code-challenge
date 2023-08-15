import React, { useState } from 'react'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import { createUser, updateUser, getUserById, deleteUser, getUserPosts } from '../client/apiClient'

const inter = Inter({ subsets: ['latin'] })

enum ACTION_TYPE {
  CREATE,
  UPDATE,
  GET,
  DELETE,
  GET_POSTS,
}

export default function Home() {
  const [inputName, setInputName] = useState('')
  const [inputEmail, setInputEmail] = useState('')
  const [inputUsername, setInputUsername] = useState('')
  const [inputDob, setInputDob] = useState('')

  const [inputId, setInputId] = useState('')

  const [actionType, setActionType] = useState(ACTION_TYPE.CREATE)

  const [response, setResponse] = useState<any>(null)

  const submitAction = () => {
    switch (actionType) {
      case ACTION_TYPE.CREATE:
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
      case ACTION_TYPE.GET_POSTS:
        submitGetUserPosts()
        break
    }
  }

  const submitCreateUser = async () => {
    const res = await createUser({
      username: inputUsername,
      fullName: inputName,
      email: inputEmail,
      dateOfBirth: inputDob,
    })

    setResponse(res)
  }

  const submitGetUser = async () => {
    const res = await getUserById(inputId)

    setResponse(res)
  }

  const submitUpdateUser = async () => {
    const res = await updateUser(inputId, {
      username: inputUsername,
      fullName: inputName,
      email: inputEmail,
      dateOfBirth: inputDob,
    })

    setResponse(res)
  }

  const submitDeleteUser = async () => {
    const res = await deleteUser(inputId)

    setResponse(res)
  }

  const submitGetUserPosts = async () => {
    const res = await getUserPosts(inputId)

    setResponse(res)
  }

  const renderIdInput = () => {
    return (
      actionType == ACTION_TYPE.UPDATE ||
      actionType == ACTION_TYPE.GET ||
      actionType == ACTION_TYPE.DELETE ||
      actionType == ACTION_TYPE.GET_POSTS
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
    setInputName('')
    setInputEmail('')
    setInputUsername('')
    setInputDob('')

    setInputId('')
  }

  const actionCopy = () => {
    switch (actionType) {
      case ACTION_TYPE.GET_POSTS:
        return 'GET Posts from'
      default:
        return ACTION_TYPE[actionType]
    }
  }

  return (
    <main className={`flex min-h-screen flex-col justify-between px-12 ${inter.className}`}>
      <section className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <span>
            <h1 className="text-lg font-bold">{actionCopy()} User </h1>
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
            <p
              className="text-indigo-700 underline cursor-pointer"
              onClick={() => toggleAction(ACTION_TYPE.GET_POSTS)}
            >
              or get user posts
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
                  value={inputId}
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
                  value={inputUsername}
                  className="border-2 mb-2 py-2 pl-2 rounded-md"
                  onChange={(e) => setInputUsername(e.target.value)}
                />
                <label htmlFor="createFullName" className="mb-1">
                  Full Name:
                </label>
                <input
                  type="text"
                  id="createFullName"
                  required
                  value={inputName}
                  className="border-2 mb-2 py-2 pl-2 rounded-md"
                  onChange={(e) => setInputName(e.target.value)}
                />
                <label htmlFor="createEmail" className="mb-1">
                  Email:
                </label>
                <input
                  type="email"
                  id="createEmail"
                  required
                  value={inputEmail}
                  className="border-2 mb-2 py-2 pl-2 rounded-md"
                  onChange={(e) => setInputEmail(e.target.value)}
                />
                <label htmlFor="createDateOfBirth" className="mb-1">
                  Date of Birth (YYYY-MM-DD):
                </label>
                <input
                  type="text"
                  id="createDateOfBirth"
                  required
                  value={inputDob}
                  className="border-2 mb-2 py-2 pl-2 rounded-md"
                  onChange={(e) => setInputDob(e.target.value)}
                />
              </>
            )}

            <button className="bg-emerald-100 p-4 rounded-md mt-4" onClick={submitAction}>
              Submit
            </button>
          </div>

          <div className="text-indigo-700 underline cursor-pointer mt-4">
            <Link href="/posts">Go to posts</Link>
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
