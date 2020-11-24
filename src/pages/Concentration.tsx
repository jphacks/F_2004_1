import React, { FC, useState } from 'react'
import LimitSlider from '../components/LimitSlider'
import { Box, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Chart from './chart'
import { User } from '../types'
import { RouteComponentProps } from 'react-router-dom'

type Props = RouteComponentProps<{ id: string }>

const useStyles = makeStyles(() => ({
  root: {
    margin: `50px 0`
  },
  userName: {
    margin: '0 5% 50px 5%'
  },
  chart: {
    margin: '0 3% 50px 3%'
  },
  slider: {
    margin: '0 5%'
  }
}))

const Concentration: FC<Props> = (props: Props) => {
  const classes = useStyles()

  const [limit, setLimit] = useState<number>(50)
  const [user, setUser] = useState<User>()

  return (
    <Box className={classes.root}>
      <Typography variant="h5" component="h2" className={classes.userName}>
        「<b>{user?.name}</b>」さんの集中度
      </Typography>
      <Box className={classes.chart}>
        <Chart userId={props.match.params.id} limit={limit} setUser={setUser} />
      </Box>
      <Box className={classes.slider}>
        <LimitSlider limit={limit} setLimit={setLimit} />
      </Box>
    </Box>
  )
}

export default Concentration
