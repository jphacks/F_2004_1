import React, { ChangeEvent, FC, useContext, useState } from 'react'
import { Box, Button, TextField, Typography } from '@material-ui/core'
import { RouteComponentProps } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import UserContext from '../contexts/UserContext'

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

const SignIn: FC<Props> = (props: Props) => {
  const classes = useStyles()

  const setUser = useContext(UserContext)?.setUser

  const [inputtedUserId, setInputtedUserId] = useState<number | null>(null)
  const [password, setPassword] = useState<string>('')

  const [isErrorUserId, setIsErrorUserId] = useState<boolean>(false)
  const [isErrorPassword, setIsErrorPassword] = useState<boolean>(false)

  const handleChangeUserId = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = parseInt(event.target.value)

    if (isNaN(value)) {
      setInputtedUserId(null)
      return
    }

    setInputtedUserId(value)
    setIsErrorUserId(false)
  }

  const handleChangePassword = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value
    setPassword(value)

    if (value !== '') setIsErrorPassword(false)
  }

  const handleButtonClick = (): void => {
    if (setUser === undefined) return

    const isValidInputtedUserId = inputtedUserId !== null
    const isValidInputtedPassword = password !== ''

    setIsErrorUserId(!isValidInputtedUserId)
    setIsErrorPassword(!isValidInputtedPassword)

    if (!isValidInputtedUserId || !isValidInputtedPassword) return

    setUser({
      id: inputtedUserId ?? -1,
      name: ''
    })

    props.history.push(`/charts/${inputtedUserId}`)
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
            value={inputtedUserId ?? ''}
            onChange={handleChangeUserId}
            helperText={isErrorUserId ? 'ユーザーIDを入力してください' : ''}
            error={isErrorUserId}
            className={classes.input}
          />

          <TextField
            id="password"
            label="パスワード"
            required={true}
            type="password"
            value={password}
            onChange={handleChangePassword}
            helperText={isErrorPassword ? 'パスワードを入力してください' : ''}
            error={isErrorPassword}
            className={classes.input}
          />
          <Button
            onClick={handleButtonClick}
            variant="contained"
            color="primary"
            className={classes.button}
          >
            SIGN IN
          </Button>
        </Box>
      </form>
    </Box>
  )
}

export default SignIn
