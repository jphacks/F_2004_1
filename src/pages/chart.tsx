import React, { FC, useCallback, useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts'
import { ConcentrationValue, User } from '../types'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { Box, Typography } from '@material-ui/core'
import LimitSlider from '../components/LimitSlider'

interface Props {
  userId: number
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: `${theme.spacing(5)}px 0`
  },
  userName: {
    textAlign: 'center'
  },
  lineChart: {
    maxWidth: '90%',
    margin: '10px auto 50px auto'
  }
}))

const Chart: FC<Props> = (props: Props) => {
  const classes = useStyles()
  const apiUrl = process.env.REACT_APP_API_URL

  const [limit, setLimit] = useState<number>(100)
  const [user, setUser] = useState<User>()
  const [concentrationValues, setConcentrationValues] = useState<
    ConcentrationValue[]
  >([])

  // eslint-disable-next-line
  const createErrorMessage = (status: any, message: string): string =>
    `Request failed.\n status: ${status}, message: ${message}`

  const getUser = useCallback(async (endpoint: string, userId: number): Promise<
    User
  > => {
    const response = await fetch(`${endpoint}/${userId}`)
    const json = await response.json()

    if (json.status != 'success') {
      throw Error(createErrorMessage(json.status, json.message))
    }

    return json.user
  }, [])

  const getConcentrationValues = useCallback(
    async (
      endpoint: string,
      userId: number,
      limit: number
    ): Promise<ConcentrationValue[]> => {
      const response = await fetch(`${endpoint}/${userId}?limit=${limit}`)
      const json = await response.json()

      if (json.status != 'success') {
        throw Error(createErrorMessage(json.status, json.message))
      }

      return json.concentration_values
        .map(
          (value: Record<string, never>): ConcentrationValue => {
            const datetime = new Date(value.created_at)
            const concentrationValue = value.concentration_value
            const isSitting = value.is_sitting

            return {
              datetime: datetime,
              concentrationValue: concentrationValue,
              isSitting: isSitting
            }
          }
        )
        .reverse()
    },
    []
  )

  useEffect(() => {
    getUser(`${apiUrl}/users`, props.userId)
      .then((user: User) => setUser(user))
      .catch(error => console.log(error))

    getConcentrationValues(
      `${apiUrl}/concentration_values`,
      props.userId,
      limit
    )
      .then((concentrationValues: ConcentrationValue[]) =>
        setConcentrationValues(concentrationValues)
      )
      .catch(error => console.log(error))
  }, [apiUrl, getConcentrationValues, getUser, limit, props.userId])

  const chart = (): JSX.Element => {
    // return users.map((user: User, index: number) => (
    return (
      <Box>
        <Typography variant="h2" className={classes.userName}>
          {user?.name}
        </Typography>
        <BarChart
          width={2000}
          height={300}
          data={concentrationValues}
          className={classes.lineChart}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="datetime"
            label={{
              value: 'Datetime',
              position: 'insideBottomRight',
              fontSize: 30
            }}
            height={70}
          />
          <YAxis
            type="number"
            domain={[1, 10]}
            label={{
              value: 'concentration',
              angle: -90,
              fontSize: 30
            }}
            width={150}
          />
          <Tooltip formatter={value => [value, 'concentration']} />
          {/*<Legend formatter={() => 'How concentrated'} iconSize={20} />*/}
          <Bar dataKey="concentrationValue" fill="#028C6A" />
        </BarChart>
      </Box>
    )
    // ))
  }

  return (
    <Box className={classes.root}>
      {chart()}
      <LimitSlider limit={limit} setLimit={setLimit} />
    </Box>
  )
}

export default Chart
