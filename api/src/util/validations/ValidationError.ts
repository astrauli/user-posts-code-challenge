export enum ValidationCode {
  MISSING_FIELD,
  INVALID_FIELD,
}

export class ValidationError {
  code: ValidationCode
  message: string

  constructor(code: ValidationCode, message: string) {
    this.code = code
    this.message = message
  }
}
