interface CreateUserInput {
  username: string
  email: string
  fullName: string
  dateOfBirth: string
}

export const createUser = async (userData: CreateUserInput) => {
  try {
    const response = await fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    return await response.json()
  } catch (e) {
    console.log(e)
    return e
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

  try {
    const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scrubInput),
    })

    return await response.json()
  } catch (e) {
    console.log(e)
    return e
  }
}

export const getUserById = async (userId: string) => {
  try {
    const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return await response.json()
  } catch (e) {
    console.log(e)
    return e
  }
}

export const deleteUser = async (userId: string) => {
  try {
    const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return await response.json()
  } catch (e) {
    console.log(e)
    return e
  }
}
