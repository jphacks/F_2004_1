import React, { FC } from 'react'
import { Box, TextField, Typography } from '@material-ui/core'

const SignIn: FC = () => {
  return (
    <Box>
      <Typography>
        デバイスに記載されているユーザーIDを入力してください。
      </Typography>
      <form noValidate autoComplete="off">
        <TextField id="user-id" label="ユーザーID" />
      </form>
    </Box>
  )
}

export default SignIn
