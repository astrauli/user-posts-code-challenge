/**
 * Enumerates validation error codes.
 *
 * @enum {ValidationCode}
 */
export enum ValidationCode {
  MISSING_FIELD,
  INVALID_FIELD,
}

/**
 * Represents a validation error with a code and message.
 *
 * @property {ValidationCode} code - The validation error code.
 * @property {string} message - The validation error message.
 * @class
 */
export class ValidationError {
  code: ValidationCode
  message: string

  /**
   * Constructs a new ValidationError instance.
   *
   * @constructor
   * @param {ValidationCode} code - The validation error code.
   * @param {string} message - The validation error message.
   */
  constructor(code: ValidationCode, message: string) {
    this.code = code
    this.message = message
  }
}
