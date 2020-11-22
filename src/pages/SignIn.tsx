import React, { FC } from 'react'
import { Box, Typography } from '@material-ui/core'
import { Link } from 'react-router-dom'

const SignIn: FC = () => {
  return (
    <Box>
      <Typography variant="h1">Sign In</Typography>
      <Link to="/charts">Charts</Link>
    </Box>
  )
}

export default SignIn
