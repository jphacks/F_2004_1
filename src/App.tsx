import React, { FC, useState } from 'react'
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom'
import { Box } from '@material-ui/core'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import { User } from './types'
import UserContext from 'contexts/UserContext'
import Header from './components/Header'
import GroupConcentrations from './pages/GroupConcentrations'
import PersonalConcentration from './pages/PersonalConcentration'

const App: FC = () => {
  const [user, setUser] = useState<User>()

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <Header />
        <Box>
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
            <Route
              path="/sign-up"
              render={props =>
                user === undefined ? (
                  <SignUp {...props} />
                ) : (
                  <Redirect to={`/charts/${user.id}`} />
                )
              }
            />
            <Route exact path="/charts/:id" component={PersonalConcentration} />
            <Route path="/charts/group/:id" component={GroupConcentrations} />
            <Route path="/*" render={() => <Redirect to="/" />} />
          </Switch>
        </Box>
      </Router>
    </UserContext.Provider>
  )
}

export default App
