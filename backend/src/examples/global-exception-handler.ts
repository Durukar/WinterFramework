import type { Context } from 'hono'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import {
    ControllerAdvice,
    ExceptionHandler,
} from '../@winterFramework/decorator/winter.decorators'
import {
    HttpException,
    NotFoundException,
    BadRequestException,
} from '../@winterFramework/exceptions/http-exception'

/**
 * Example global exception handler — catches all HttpExceptions
 * and returns structured JSON error responses.
 */
@ControllerAdvice()
export class GlobalExceptionHandler {
    @ExceptionHandler(NotFoundException)
    handleNotFound(err: NotFoundException, c: Context) {
        console.log(`[ExceptionHandler] 404: ${err.message}`)
        return c.json(
            { error: err.message, status: 404, timestamp: new Date().toISOString() },
            404,
        )
    }

    @ExceptionHandler(BadRequestException)
    handleBadRequest(err: BadRequestException, c: Context) {
        console.log(`[ExceptionHandler] 400: ${err.message}`)
        return c.json(
            { error: err.message, status: 400, timestamp: new Date().toISOString() },
            400,
        )
    }

    @ExceptionHandler(HttpException)
    handleHttpException(err: HttpException, c: Context) {
        console.log(`[ExceptionHandler] ${err.status}: ${err.message}`)
        return c.json(
            { error: err.message, status: err.status, timestamp: new Date().toISOString() },
            err.status as ContentfulStatusCode,
        )
    }
}
