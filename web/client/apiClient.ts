interface CreateUserInput {
  username: string
  email: string
  fullName: string
  dateOfBirth: string
}

interface ClientResponse {
  result?: Promise<any>
  status: number | undefined
  error?: unknown
}

export const createUser = async (userData: CreateUserInput): ClientResponse => {
  let response

  try {
    response = await fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    return {
      result: await response.json(),
      status: response.status,
    }
  } catch (e) {
    console.log(e)
    return {
      status: response?.status,
      error: e as unknown,
    }
  }
}

export const updateUser = async (userId: string, userData: Partial<CreateUserInput>) => {
  const scrubInput: Partial<CreateUserInput> = {}

  for (const key in userData) {
    if (userData.hasOwnProperty(key)) {
      const value = userData[key as keyof CreateUserInput]
      if (value !== '' && value !== null) {
        scrubInput[key as keyof CreateUserInput] = value
      }
    }
  }

  let response

  try {
    response = await fetch(`http://localhost:3000/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scrubInput),
    })

    return {
      result: await response.json(),
      status: response.status,
    }
  } catch (e) {
    console.log(e)
    return {
      status: response?.status,
      error: e as unknown,
    }
  }
}

export const getUserById = async (userId: string) => {
  let response

  try {
    response = await fetch(`http://localhost:3000/api/users/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return {
      result: await response.json(),
      status: response.status,
    }
  } catch (e) {
    console.log(e)
    return {
      status: response?.status,
      error: e as unknown,
    }
  }
}

export const deleteUser = async (userId: string) => {
  let response

  try {
    response = await fetch(`http://localhost:3000/api/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return {
      result: await response.json(),
      status: response.status,
    }
  } catch (e) {
    console.log(e)
    return {
      status: response?.status,
      error: e as unknown,
    }
  }
}

export const getUserPosts = async (userId: string) => {
  let response
  try {
    response = await fetch(`http://localhost:3000/api/users/${userId}/posts`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return {
      result: await response.json(),
      status: response.status,
    }
  } catch (e) {
    console.log(e)
    return {
      status: response?.status,
      error: e as unknown,
    }
  }
}
