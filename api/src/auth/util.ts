import crypto from 'crypto'

/**
 * Generates a hash using the provided password and salt.
 *
 * @param {string} password - The password to hash.
 * @param {string} salt - The salt to use for hashing.
 * @returns {string} The generated hash.
 */
const hashFun = (password: string, salt: string): string => {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
}

/**
 * Checks if a given password matches the stored hash.
 *
 * @param {string} password - The password to validate.
 * @param {string} hash - The stored hash.
 * @param {string} salt - The salt used for hashing.
 * @returns {boolean} Returns true if the password matches the hash, otherwise false.
 */
export const isValidPassword = (password: string, hash: string, salt: string) => {
  return hash === hashFun(password, salt)
}

/**
 * Generates a salt and hash from the provided password.
 *
 * @param {string} password - The password to generate salt and hash for.
 * @returns {{ salt: string, hash: string }} An object containing the generated salt and hash.
 */
export const generateSaltHashFromPassword = (password: string) => {
  const salt = crypto.randomBytes(32).toString('hex')

  return {
    salt: salt,
    hash: hashFun(password, salt),
  }
}
