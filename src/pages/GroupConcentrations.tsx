import React, { FC, useCallback, useEffect, useState } from 'react'
import LimitSlider from '../components/LimitSlider'
import { Box, Button, Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Chart from '../components/Chart'
import { User } from '../types'
import { Link, RouteComponentProps } from 'react-router-dom'
import { createErrorMessage } from '../utils'

type Props = RouteComponentProps<{ id: string }>

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: '50px 0'
  },
  linkWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    margin: '0 5% 50px 5%'
  },
  link: {
    color: theme.palette.common.white,
    textDecoration: 'none'
  },
  box: {
    marginBottom: 100
  },
  userName: {
    margin: '0 5% 30px 5%'
  },
  chart: {
    margin: '0 3% 10px 3%'
  },
  slider: {
    margin: '0 5%'
  }
}))

const GroupConcentrations: FC<Props> = (props: Props) => {
  const classes = useStyles()

  const apiUrl = process.env.REACT_APP_API_URL ?? 'http://localhost/api'
  const userId = parseInt(props.match.params.id)
  const [limit, setLimit] = useState<number>(50)

  const [groupId, setGroupId] = useState<number>()
  const fetchGroupId = useCallback(
    async (apiUrl: string, userId: number): Promise<number> => {
      const response = await fetch(`${apiUrl}/users/${userId}`)
      const json = await response.json()

      if (json.status != 'success') {
        throw Error(createErrorMessage(json.status, json.message))
      }

      return json.user.group_id
    },
    []
  )
  useEffect(() => {
    fetchGroupId(apiUrl, userId).then(setGroupId).catch(console.log)
  }, [apiUrl, fetchGroupId, userId])

  const [users, setUsers] = useState<User[]>()
  const fetchGroupUsers = useCallback(
    async (apiUrl: string, groupId: number): Promise<User[]> => {
      const response = await fetch(`${apiUrl}/users/group/${groupId}`)
      const json = await response.json()

      if (json.status != 'success') {
        throw Error(createErrorMessage(json.status, json.message))
      }

      return json.users
    },
    []
  )
  useEffect(() => {
    if (groupId === undefined) return
    fetchGroupUsers(apiUrl, groupId).then(setUsers).catch(console.log)
  }, [apiUrl, fetchGroupUsers, groupId])

  const setUser = (user: User, index: number): void => {
    if (users === undefined) return

    users[index] = user
    setUsers(users)
  }

  return (
    <Box className={classes.root}>
      <Box className={classes.linkWrapper}>
        <Button color="secondary" variant="contained">
          <Link to={`/charts/${userId}`} className={classes.link}>
            自分の集中力だけ見る
          </Link>
        </Button>
      </Box>
      {users?.map(
        (user: User, index: number): JSX.Element => (
          <Box key={index} className={classes.box}>
            <Typography
              variant="h5"
              component="h2"
              className={classes.userName}
            >
              「<b>{user?.name}</b>」さんの集中度
            </Typography>
            <Box className={classes.chart}>
              <Chart
                userId={`${user.id}`}
                limit={limit}
                setUser={(user: User) => setUser(user, index)}
              />
            </Box>
            <Box className={classes.slider}>
              <LimitSlider limit={limit} setLimit={setLimit} />
            </Box>
          </Box>
        )
      )}
    </Box>
  )
}

export default GroupConcentrations
