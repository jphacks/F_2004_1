import React, { ChangeEvent, FC, useState } from 'react'
import { Box, Button, TextField, Typography } from '@material-ui/core'
import { RouteComponentProps } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { createErrorMessage } from '../utils'

type Props = RouteComponentProps

const useStyles = makeStyles(() => ({
  root: {
    margin: '30px'
  },
  typography: {
    textAlign: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '20px'
  },
  input: {
    width: 200,
    marginBottom: '20px'
  },
  button: {
    width: 100,
    marginTop: '20px'
  }
}))

const SignUp: FC<Props> = (props: Props) => {
  const classes = useStyles()
  const apiUrl = process.env.REACT_APP_API_URL

  const [userId, setUserId] = useState<number | null>(null)
  const [userName, setUserName] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const [emptyUserId, setEmptyUserId] = useState<boolean>(false)
  const [duplicateUserId, setduplicateUserId] = useState<boolean>(false)
  const [emptyUserName, setEmptyUserName] = useState<boolean>(false)
  const [emptyPassword, setEmptyPassword] = useState<boolean>(false)

  const handleChangeUserId = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = parseInt(event.target.value)

    if (isNaN(value)) {
      setUserId(null)
      return
    }

    setUserId(value)
    setEmptyUserId(false)
    setduplicateUserId(false)
  }

  const handleChangeUserName = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value
    setUserName(value)

    if (value !== '') setEmptyUserName(false)
  }

  const handleChangePassword = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value
    setPassword(value)

    if (value !== '') setEmptyPassword(false)
  }

  const handleButtonClick = async (): Promise<void> => {
    const isValidUserId = userId !== null
    const isValidUserName = userName !== ''
    const isValidPassword = password !== ''

    setEmptyUserId(!isValidUserId)
    setEmptyUserName(!isValidUserName)
    setEmptyPassword(!isValidPassword)

    if (!isValidUserId || !isValidUserName || !isValidPassword) return

    const data = new FormData()
    data.append('id', `${userId}`)
    data.append('name', userName)

    const response = await fetch(`${apiUrl}/users`, {
      method: 'POST',
      body: data
    })
    const json = await response.json()

    if (
      json.status !== 'success' &&
      json.message === 'Requested user id exists already.'
    ) {
      setduplicateUserId(true)
      return
    }

    if (json.status !== 'success') {
      throw Error(createErrorMessage(json.status, json.message))
    }

    const responseUserId = json.user.id

    props.history.push(`/charts/${responseUserId}`)
  }

  const getUserIdErrorMessage = (): string => {
    if (emptyUserId) return 'ユーザーIDを入力してください'

    if (duplicateUserId) return '既に存在するユーザーIDです'

    return ''
  }

  return (
    <Box className={classes.root}>
      <Typography className={classes.typography}>
        お手持ちの製品に記載してあるユーザーIDと、ご自身のお名前、ご自身で考えたパスワードを入力してください。
      </Typography>
      <form noValidate autoComplete="off">
        <Box className={classes.form}>
          <TextField
            id="user-id"
            label="ユーザーID"
            required={true}
            type="number"
            value={userId ?? ''}
            onChange={handleChangeUserId}
            helperText={getUserIdErrorMessage()}
            error={emptyUserId || duplicateUserId}
            className={classes.input}
          />{' '}
          <TextField
            id="user-name"
            label="お名前"
            required={true}
            type="text"
            value={userName ?? ''}
            onChange={handleChangeUserName}
            helperText={emptyUserName ? 'お名前を入力してください' : ''}
            error={emptyUserName}
            className={classes.input}
          />
          <TextField
            id="password"
            label="パスワード"
            required={true}
            type="password"
            value={password ?? ''}
            onChange={handleChangePassword}
            helperText={emptyPassword ? 'パスワードを入力してください' : ''}
            error={emptyPassword}
            className={classes.input}
          />
          <Button
            onClick={handleButtonClick}
            variant="contained"
            color="primary"
            className={classes.button}
          >
            SIGN UP
          </Button>
        </Box>
      </form>
    </Box>
  )
}

export default SignUp
