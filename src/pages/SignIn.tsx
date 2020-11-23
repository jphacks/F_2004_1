import React, { ChangeEvent, FC, useState } from 'react'
import { Box, Button, TextField, Typography } from '@material-ui/core'
import { RouteComponentProps } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'

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
    width: 100
  }
}))

const SignIn: FC<Props> = (props: Props) => {
  const classes = useStyles()

  const [userId, setUserId] = useState<number>()
  const [password, setPassword] = useState<string>()

  const [errorUserId, setErrorUserId] = useState<boolean>(false)
  const [errorPassword, setErrorPassword] = useState<boolean>(false)

  const handleChangeUserId = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = parseInt(event.target.value)
    setUserId(value)

    if (!isNaN(value)) setErrorUserId(false)
  }

  const handleChangePassword = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value
    setPassword(value)

    if (value !== '') setErrorPassword(false)
  }

  const handleButtonClick = (): void => {
    const isValidUserId = userId !== undefined
    const isValidPassword = password !== undefined

    setErrorUserId(!isValidUserId)
    setErrorPassword(!isValidPassword)

    if (!isValidUserId || !isValidPassword) return

    props.history.push(`/charts/${userId}`)
  }

  return (
    <Box className={classes.root}>
      <Typography className={classes.typography}>
        ユーザーIDとパスワードを入力してください。
      </Typography>
      <form noValidate autoComplete="off">
        <Box className={classes.form}>
          <TextField
            id="user-id"
            label="ユーザーID"
            required={true}
            type="number"
            value={userId}
            onChange={handleChangeUserId}
            helperText={errorUserId ? 'ユーザーIDを入力してください' : ''}
            error={errorUserId}
            className={classes.input}
          />
          <TextField
            id="password"
            label="パスワード"
            required={true}
            type="password"
            value={password}
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

export default SignIn
