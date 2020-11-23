export const formatToYMD = (datetime: Date): string => {
  const year = datetime.getFullYear()
  const month = datetime.getMonth()
  const date = datetime.getDate()

  return `${year}/${month}/${date}`
}

export const formatToHMS = (datetime: Date): string => {
  const hour = datetime.getHours()
  const minute = datetime.getMinutes()
  const second = datetime.getSeconds()

  return `${hour}:${minute}:${second}`
}

// eslint-disable-next-line
export const createErrorMessage = (status: any, message: string): string =>
  `Request failed.\n status: ${status}, message: ${message}`
