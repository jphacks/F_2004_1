import React, { FC, useState } from 'react'
import LimitSlider from '../components/LimitSlider'
import { Box, Button, Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Chart from '../components/Chart'
import { User } from '../types'
import { Link, RouteComponentProps } from 'react-router-dom'

type Props = RouteComponentProps<{ id: string }>

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: `50px 0`
  },
  groupLinkWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    margin: '0 5% 50px 5%'
  },
  groupLink: {
    color: theme.palette.common.white,
    textDecoration: 'none'
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

const PersonalConcentration: FC<Props> = (props: Props) => {
  const classes = useStyles()

  const [limit, setLimit] = useState<number>(50)
  const [user, setUser] = useState<User>()

  return (
    <Box className={classes.root}>
      <Box className={classes.groupLinkWrapper}>
        <Button color="secondary" variant="contained">
          <Link to={`/charts/group/${user?.id}`} className={classes.groupLink}>
            グループを見る
          </Link>
        </Button>
      </Box>
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

export default PersonalConcentration
