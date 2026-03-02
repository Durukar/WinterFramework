/**
 * Base class for all HTTP exceptions in Winter Framework.
 * Inspired by Spring's `HttpStatus`-based exception hierarchy.
 *
 * @example
 * ```ts
 * throw new HttpException(400, 'Invalid request data');
 * throw new NotFoundException('User not found');
 * ```
 */
export class HttpException extends Error {
    /** The HTTP status code for this exception. */
    public readonly status: number

    /**
     * @param status - HTTP status code.
     * @param message - Human-readable error message.
     */
    constructor(status: number, message: string) {
        super(message)
        this.status = status
        this.name = 'HttpException'
    }
}

/**
 * HTTP 400 — Bad Request.
 * Thrown when the request is malformed or contains invalid data.
 */
export class BadRequestException extends HttpException {
    constructor(message: string = 'Bad Request') {
        super(400, message)
        this.name = 'BadRequestException'
    }
}

/**
 * HTTP 401 — Unauthorized.
 * Thrown when authentication is required but not provided or invalid.
 */
export class UnauthorizedException extends HttpException {
    constructor(message: string = 'Unauthorized') {
        super(401, message)
        this.name = 'UnauthorizedException'
    }
}

/**
 * HTTP 403 — Forbidden.
 * Thrown when the user is authenticated but lacks permission.
 */
export class ForbiddenException extends HttpException {
    constructor(message: string = 'Forbidden') {
        super(403, message)
        this.name = 'ForbiddenException'
    }
}

/**
 * HTTP 404 — Not Found.
 * Thrown when the requested resource does not exist.
 */
export class NotFoundException extends HttpException {
    constructor(message: string = 'Not Found') {
        super(404, message)
        this.name = 'NotFoundException'
    }
}

/**
 * HTTP 409 — Conflict.
 * Thrown when the request conflicts with the current state (e.g. duplicate entry).
 */
export class ConflictException extends HttpException {
    constructor(message: string = 'Conflict') {
        super(409, message)
        this.name = 'ConflictException'
    }
}

/**
 * HTTP 500 — Internal Server Error.
 * Thrown for unexpected server-side errors.
 */
export class InternalServerErrorException extends HttpException {
    constructor(message: string = 'Internal Server Error') {
        super(500, message)
        this.name = 'InternalServerErrorException'
    }
}
