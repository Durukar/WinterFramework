/**
 * Method decorator that wraps a controller method with debugging output.
 * Logs method execution, parameters, response details, and timing information to the console.
 *
 * **⚠️ DO NOT USE IN PRODUCTION** — this decorator is intended for development only.
 *
 * @param options - Configuration for what to log.
 * @param options.showParams - Log method arguments (default: `true`).
 * @param options.showReturn - Log the return value / HTTP response (default: `true`).
 * @param options.showTime - Log execution time in ms (default: `true`).
 * @returns A method decorator function.
 *
 * @example
 * ```ts
 * @GetMapping()
 * @DebuggerLogger({ showTime: true, showParams: false })
 * findAll(c: Context) {
 *   return c.json([]);
 * }
 * ```
 */
export function DebuggerLogger(
  options: {
    showParams?: boolean
    showReturn?: boolean
    showTime?: boolean
  } = {
      showParams: true,
      showReturn: true,
      showTime: true,
    },
) {
  return function (
    _target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value

    descriptor.value = async function (this: { constructor: { name: string } }, ...args: unknown[]) {
      const controllerName = this.constructor.name
      const methodName = propertyKey

      console.log(`\n[DEBUG] 🔍 Executing ${controllerName}.${methodName}()`)

      if (options.showParams && args.length > 0) {
        const filteredArgs = args.map((arg) => {
          if (
            arg &&
            typeof arg === 'object' &&
            'req' in arg &&
            'res' in arg
          ) {
            return '[Context Object]'
          }
          return arg
        })

        console.log(
          `[DEBUG] 📥 Parameters:`,
          JSON.stringify(filteredArgs, null, 2),
        )
      }

      const startTime = performance.now()
      let result: Response | unknown

      try {
        result = await originalMethod.apply(this, args)

        if (options.showTime) {
          const endTime = performance.now()
          const executionTime = (endTime - startTime).toFixed(2)
          console.log(`[DEBUG] ⏱️  Execution time: ${executionTime}ms`)
        }

        if (options.showReturn) {
          if (result instanceof Response) {
            const contentType = result.headers.get('content-type') || ''
            console.log(
              `[DEBUG] 📤 Response status: ${result.status} ${result.statusText}`,
            )
            console.log(`[DEBUG] 📤 Content-Type: ${contentType}`)

            if (contentType.includes('application/json')) {
              try {
                const clonedResponse = result.clone()
                const jsonData: unknown = await clonedResponse.json()
                console.log(`[DEBUG] 📤 Response body:`, jsonData)
              } catch (err) {
                const message = err instanceof Error ? err.message : String(err)
                console.log(
                  `[DEBUG] 📤 Could not parse JSON response: ${message}`,
                )
              }
            } else {
              console.log(
                `[DEBUG] 📤 Response: [Body not shown - non-JSON content]`,
              )
            }
          } else {
            console.log(`[DEBUG] 📤 Result:`, result)
          }
        }

        console.log(
          `[DEBUG] ✅ ${controllerName}.${methodName}() completed successfully`,
        )
        return result
      } catch (error) {
        console.error(
          `[DEBUG] ❌ Error in ${controllerName}.${methodName}():`,
          error,
        )
        throw error
      }
    }

    return descriptor
  }
}
