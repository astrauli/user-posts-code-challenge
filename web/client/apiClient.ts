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
