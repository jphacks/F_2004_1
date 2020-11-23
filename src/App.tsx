import React, { FC, useState } from 'react'
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom'
import Chart from './pages/chart'
import { Box } from '@material-ui/core'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import { User } from './types'
import UserContext from 'contexts/UserContext'

const App: FC = () => {
  const [user, setUser] = useState<User>()

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Box>
        <Router>
          <Switch>
            <Route
              exact
              path="/"
              render={props =>
                user === undefined ? (
                  <SignIn {...props} />
                ) : (
                  <Redirect to={`/charts/${user.id}`} />
                )
              }
            />
            <Route path="/sign-up" component={SignUp} />
            <Route path="/charts/:id" render={props => <Chart {...props} />} />
            <Route path="/*" render={() => <Redirect to="/" />} />
          </Switch>
        </Router>
      </Box>
    </UserContext.Provider>
  )
}

export default App
