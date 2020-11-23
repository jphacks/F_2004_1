import { makeStyles, Theme } from '@material-ui/core/styles'
import React, { FC } from 'react'
import { AppBar, Box, Button, Toolbar, Typography } from '@material-ui/core'
import { Link } from 'react-router-dom'

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    flex: 1
  },
  button: {
    margin: '0 10px'
  },
  link: {
    color: theme.palette.common.white,
    textDecoration: 'none'
  }
}))
const Header: FC = () => {
  const classes = useStyles()

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="h1" className={classes.title}>
          Effective Work
        </Typography>

        <Box>
          <Button color="inherit" className={classes.button}>
            <Link to="/" className={classes.link}>
              SIGN IN
            </Link>
          </Button>{' '}
          <Button color="inherit" className={classes.button}>
            <Link to="/sign-up" className={classes.link}>
              SIGN UP
            </Link>
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
