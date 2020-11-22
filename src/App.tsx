import React, { FC } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Chart from './pages/chart'
import { Box } from '@material-ui/core'
import SignIn from './pages/SignIn'

const App: FC = () => {
  return (
    <Box>
      <Router>
        <Route exact path="/" component={SignIn} />
        <Route path="/charts" component={Chart} />
      </Router>
    </Box>
  )
}

export default App
