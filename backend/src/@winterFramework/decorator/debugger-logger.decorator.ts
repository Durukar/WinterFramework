/* eslint-disable @typescript-eslint/no-explicit-any */
/**
  I created this Debug controller to assist me in the development process.

  DO NOT USE IN PRODUCTION!!!!!!
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
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const controllerName = this.constructor.name
      const methodName = propertyKey

      console.log(`\n[DEBUG] 🔍 Executing ${controllerName}.${methodName}()`)

      if (options.showParams && args.length > 0) {
        const filteredArgs = args.map((arg) => {
          if (arg && arg.req && arg.res) {
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
      let result

      try {
        result = await originalMethod.apply(this, args)

        if (options.showTime) {
          const endTime = performance.now()
          const executionTime = (endTime - startTime).toFixed(2)
          console.log(`[DEBUG] ⏱️  Execution time: ${executionTime}ms`)
        }

        if (options.showReturn) {
          if (
            result &&
            typeof result === 'object' &&
            'headers' in result &&
            'body' in result
          ) {
            const contentType = result.headers.get('content-type') || ''
            console.log(
              `[DEBUG] 📤 Response status: ${result.status} ${result.statusText}`,
            )
            console.log(`[DEBUG] 📤 Content-Type: ${contentType}`)

            if (contentType.includes('application/json')) {
              try {
                const clonedResponse = result.clone()
                const jsonData = await clonedResponse.json()
                console.log(`[DEBUG] 📤 Response body:`, jsonData)
              } catch (err) {
                console.log(
                  `[DEBUG] 📤 Could not parse JSON response: ${err.message}`,
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
