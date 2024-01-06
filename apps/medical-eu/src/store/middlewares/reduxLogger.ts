// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createLogger } = require(`redux-logger`)
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
const reduxLoggerMW = createLogger({
  collapsed: (logEntry: { error: any }) => !logEntry.error
})

export default reduxLoggerMW
