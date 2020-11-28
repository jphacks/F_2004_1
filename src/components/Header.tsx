import { makeStyles, Theme } from '@material-ui/core/styles'
import React, { FC, useContext } from 'react'
import { AppBar, Box, Button, Toolbar, Typography } from '@material-ui/core'
import { Link, RouteComponentProps } from 'react-router-dom'
import UserContext from '../contexts/UserContext'
import { withRouter } from 'react-router'

type Props = RouteComponentProps

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    flex: 1
  },
  button: {
    margin: '0 10px'
  },
  link: {
    color: theme.palette.common.white,
    fontSize: 15,
    textDecoration: 'none'
  }
}))
const Header: FC<Props> = (props: Props) => {
  const classes = useStyles()

  const userContext = useContext(UserContext)

  const signOut = (): void => {
    if (useContext === undefined) return

    userContext?.setUser(undefined)

    props.history.push('/')
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="h1" className={classes.title}>
          Effective Work
        </Typography>
        {userContext?.user === undefined ? (
          <Box>
            <Button color="inherit" className={classes.button}>
              <Link to="/" className={classes.link}>
                SIGN IN
              </Link>
            </Button>
            <Button color="inherit" className={classes.button}>
              <Link to="/sign-up" className={classes.link}>
                SIGN UP
              </Link>
            </Button>
          </Box>
        ) : (
          <Box>
            <Button
              onClick={signOut}
              color="inherit"
              className={classes.button}
            >
              <Typography className={classes.link}>SIGN OUT</Typography>
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default withRouter(Header)
