import React, { useState } from 'react'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import { createPost, getPostById, updatePost, deletePost } from '../client/apiClient'

const inter = Inter({ subsets: ['latin'] })

enum ACTION_TYPE {
  CREATE,
  UPDATE,
  GET,
  DELETE,
}

export default function Posts() {
  const [inputTitle, setInputTitle] = useState('')
  const [inputDescription, setInputDescription] = useState('')

  const [userInputId, setUserInputId] = useState('')
  const [inputId, setInputId] = useState('')

  const [actionType, setActionType] = useState(ACTION_TYPE.CREATE)

  const [response, setResponse] = useState<any>(null)

  const submitAction = () => {
    switch (actionType) {
      case ACTION_TYPE.CREATE:
        submitCreatePost()
        break
      case ACTION_TYPE.UPDATE:
        submitUpdatePost()
        break
      case ACTION_TYPE.GET:
        submitGetPost()
        break
      case ACTION_TYPE.DELETE:
        submitDeletePost()
        break
    }
  }

  const submitCreatePost = async () => {
    const res = await createPost(userInputId, {
      title: inputTitle,
      description: inputDescription,
    })

    setResponse(res)
  }

  const submitGetPost = async () => {
    const res = await getPostById(inputId)

    setResponse(res)
  }

  const submitUpdatePost = async () => {
    const res = await updatePost(inputId, {
      title: inputTitle,
      description: inputDescription,
    })

    setResponse(res)
  }

  const submitDeletePost = async () => {
    const res = await deletePost(inputId)

    setResponse(res)
  }

  const renderUserIdInput = () => {
    return actionType == ACTION_TYPE.CREATE
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
    setInputTitle('')
    setInputDescription('')

    setInputId('')
    setUserInputId('')
  }

  const actionCopy = () => {
    switch (actionType) {
      default:
        return ACTION_TYPE[actionType]
    }
  }

  return (
    <main className={`flex min-h-screen flex-col justify-between px-12 ${inter.className}`}>
      <section className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <span>
            <h1 className="text-lg font-bold">{actionCopy()} Post </h1>
            <p
              className="text-indigo-700 underline cursor-pointer"
              onClick={() => toggleAction(ACTION_TYPE.UPDATE)}
            >
              or update post
            </p>
            <p
              className="text-indigo-700 underline cursor-pointer"
              onClick={() => toggleAction(ACTION_TYPE.CREATE)}
            >
              or create post
            </p>
            <p
              className="text-indigo-700 underline cursor-pointer"
              onClick={() => toggleAction(ACTION_TYPE.GET)}
            >
              or get post
            </p>
            <p
              className="text-indigo-700 underline cursor-pointer"
              onClick={() => toggleAction(ACTION_TYPE.DELETE)}
            >
              or delete post
            </p>
          </span>
          <div className={'flex flex-col'}>
            {renderUserIdInput() && (
              <>
                <label htmlFor="updateUserId" className="mb-1">
                  User Id:
                </label>
                <input
                  type="text"
                  id="updateUserId"
                  required
                  value={userInputId}
                  className="border-2 mb-2 py-2 pl-2 rounded-md"
                  onChange={(e) => setUserInputId(e.target.value)}
                />
              </>
            )}
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
                  Title:
                </label>
                <input
                  type="text"
                  id="createUsername"
                  required
                  value={inputTitle}
                  className="border-2 mb-2 py-2 pl-2 rounded-md"
                  onChange={(e) => setInputTitle(e.target.value)}
                />
                <label htmlFor="createFullName" className="mb-1">
                  Description:
                </label>
                <input
                  type="text"
                  id="createFullName"
                  required
                  value={inputDescription}
                  className="border-2 mb-2 py-2 pl-2 rounded-md"
                  onChange={(e) => setInputDescription(e.target.value)}
                />
              </>
            )}

            <button className="bg-emerald-100 p-4 rounded-md mt-4" onClick={submitAction}>
              Submit
            </button>
          </div>

          <div className="text-indigo-700 underline cursor-pointer mt-4">
            <Link href="/">Go to users</Link>
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
