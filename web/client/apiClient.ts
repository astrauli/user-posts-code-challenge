interface CreateUserInput {
  username: string
  email: string
  fullName: string
  dateOfBirth: string
}

interface CreatePostInput {
  title: string
  description: string
}

interface ClientResponse {
  result?: Promise<any>
  status: number | undefined
  error?: unknown
}

export const createUser = async (userData: CreateUserInput): Promise<ClientResponse> => {
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

export const updateUser = async (
  userId: string,
  userData: Partial<CreateUserInput>
): Promise<ClientResponse> => {
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

export const getUserById = async (userId: string): Promise<ClientResponse> => {
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

export const deleteUser = async (userId: string): Promise<ClientResponse> => {
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

export const getUserPosts = async (userId: string): Promise<ClientResponse> => {
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

export const createPost = async (
  userId: string,
  userData: CreatePostInput
): Promise<ClientResponse> => {
  let response

  try {
    response = await fetch(`http://localhost:3000/api/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, ...userData }),
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

export const updatePost = async (
  postId: string,
  postData: Partial<CreatePostInput>
): Promise<ClientResponse> => {
  const scrubInput: Partial<CreatePostInput> = {}

  for (const key in postData) {
    if (postData.hasOwnProperty(key)) {
      const value = postData[key as keyof CreatePostInput]
      if (value !== '' && value !== null) {
        scrubInput[key as keyof CreatePostInput] = value
      }
    }
  }

  let response

  try {
    response = await fetch(`http://localhost:3000/api/posts/${postId}`, {
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

export const getPostById = async (postId: string): Promise<ClientResponse> => {
  let response

  try {
    response = await fetch(`http://localhost:3000/api/posts/${postId}`, {
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

export const deletePost = async (postId: string): Promise<ClientResponse> => {
  let response

  try {
    response = await fetch(`http://localhost:3000/api/posts/${postId}`, {
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

export const signup = async (username: string, password: string): Promise<ClientResponse> => {
  let response

  try {
    response = await fetch(`http://localhost:3000/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
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

export const login = async (username: string, password: string): Promise<ClientResponse> => {
  let response

  try {
    response = await fetch(`http://localhost:3000/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
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
