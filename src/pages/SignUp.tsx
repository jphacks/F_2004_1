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

  const [errorUserId, setErrorUserId] = useState<boolean>(false)
  const [errorUserName, setErrorUserName] = useState<boolean>(false)
  const [errorPassword, setErrorPassword] = useState<boolean>(false)

  const handleChangeUserId = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = parseInt(event.target.value)

    if (isNaN(value)) {
      setUserId(null)
      return
    }

    setUserId(value)
    setErrorUserId(false)
  }

  const handleChangeUserName = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value
    setUserName(value)

    if (value !== '') setErrorUserName(false)
  }

  const handleChangePassword = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value
    setPassword(value)

    if (value !== '') setErrorPassword(false)
  }

  const handleButtonClick = async (): Promise<void> => {
    const isValidUserId = userId !== null
    const isValidUserName = userName !== ''
    const isValidPassword = password !== ''

    setErrorUserId(!isValidUserId)
    setErrorUserName(!isValidUserName)
    setErrorPassword(!isValidPassword)

    if (!isValidUserId || !isValidPassword) return

    const data = new FormData()
    data.append('id', `${userId}`)
    data.append('name', userName)

    const response = await fetch(`${apiUrl}/users`, {
      method: 'POST',
      body: data
    })
    const json = await response.json()

    if (json.status != 'success') {
      throw Error(createErrorMessage(json.status, json.message))
    }

    const responseUserId = json.user.id

    props.history.push(`/charts/${responseUserId}`)
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
            helperText={errorUserId ? 'ユーザーIDを入力してください' : ''}
            error={errorUserId}
            className={classes.input}
          />{' '}
          <TextField
            id="user-name"
            label="お名前"
            required={true}
            type="text"
            value={userName ?? ''}
            onChange={handleChangeUserName}
            helperText={errorUserName ? 'お名前を入力してください' : ''}
            error={errorUserName}
            className={classes.input}
          />
          <TextField
            id="password"
            label="パスワード"
            required={true}
            type="password"
            value={password ?? ''}
            onChange={handleChangePassword}
            helperText={errorPassword ? 'パスワードを入力してください' : ''}
            error={errorPassword}
            className={classes.input}
          />
          <Button
            onClick={handleButtonClick}
            variant="contained"
            color="primary"
            className={classes.button}
          >
            OK
          </Button>
        </Box>
      </form>
    </Box>
  )
}

export default SignUp
