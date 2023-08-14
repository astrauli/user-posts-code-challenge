/**
 * Validates whether an email address is in a valid format.
 *
 * @param {string} email - The email address to validate.
 * @returns {boolean} true if the email is valid, otherwise false.
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/

  return emailRegex.test(email)
}
