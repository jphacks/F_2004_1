import React, { FC, useEffect, useState } from 'react'
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'
import { ConcentrationValue, User } from '../types'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { formatToHMS } from '../utils'
import { Box, Typography } from '@material-ui/core'
import LimitSlider from './LimitSlider'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(3)
  },
  title: {
    textAlign: 'center'
  },
  lineChart: {
    margin: '50px auto 0 auto'
  }
}))

const App: FC = () => {
  const classes = useStyles()
  const apiUrl = process.env.REACT_APP_API_URL

  const [limit, setLimit] = useState<number>(100)
  const [users, setUsers] = useState<User[]>([])
  const [concentrationValues, setConcentrationValues] = useState<
    ConcentrationValue[][]
  >([])

  useEffect(() => {
    fetch(`${apiUrl}/users`)
      .then(userResponse => userResponse.json())
      .then(userResponseJson => {
        if (userResponseJson.status != 'success') {
          const message = `Response status is not success\n status: ${userResponseJson.status}, message: ${userResponseJson.message}`
          throw Error(message)
        }

        setUsers(userResponseJson.users)

        userResponseJson.users.forEach((user: User, index: number) => {
          fetch(`${apiUrl}/concentration_values/${user.id}?limit=${limit}`)
            .then(concentrationValuesResponse =>
              concentrationValuesResponse.json()
            )
            .then(concentrationValuesResponseJson => {
              if (concentrationValuesResponseJson.status !== 'success') {
                const message = `Response status is not success\n status: ${concentrationValuesResponseJson.status}, message: ${concentrationValuesResponseJson.message}`
                throw Error(message)
              }

              const values: ConcentrationValue[] = concentrationValuesResponseJson.concentration_values
                .map((value: Record<string, never>) => {
                  const datetime = new Date(value.created_at)
                  const concentrationValue = value.concentration_value
                  const isSitting = value.is_sitting

                  return {
                    datetime: formatToHMS(datetime),
                    concentrationValue: concentrationValue,
                    isSitting: isSitting
                  }
                })
                .reverse()

              setConcentrationValues(prevState => {
                const newState = JSON.parse(JSON.stringify(prevState))
                newState[index] = values

                return newState
              })
            })
        })
      })
      .catch(error => console.log(error))
  }, [apiUrl, limit])

  const charts = (): JSX.Element[] => {
    return users.map((user: User, index: number) => (
      <Box key={index}>
        <Typography>{user.name}</Typography>
        <LineChart
          width={1000}
          height={500}
          data={concentrationValues[index]}
          className={classes.lineChart}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="datetime"
            label={{
              value: 'Datetime',
              position: 'insideBottomRight'
            }}
            height={50}
          />
          <YAxis
            type="number"
            domain={[1, 10]}
            label={{
              value: 'How concentrated',
              angle: -90
            }}
            width={100}
          />
          <Tooltip formatter={value => [value, 'How concentrated']} />
          {/*<Legend formatter={() => 'How concentrated'} iconSize={20} />*/}
          <Line
            type="monotone"
            dataKey="concentrationValue"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </Box>
    ))
  }

  return (
    <Box className={classes.root}>
      {charts()}
      <LimitSlider limit={limit} setLimit={setLimit} />
    </Box>
  )
}

export default App
