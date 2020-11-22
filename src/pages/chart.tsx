import React, { FC, useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts'
import { ConcentrationValue, User } from '../types'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { formatToHMS } from '../utils'
import { Box, Typography } from '@material-ui/core'
import LimitSlider from '../components/LimitSlider'

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

const Chart: FC = () => {
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
        <Typography variant="h2" className={classes.userName}>
          {user.name}
        </Typography>
        <BarChart
          width={2000}
          height={300}
          data={concentrationValues[index]}
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
    ))
  }

  return (
    <Box className={classes.root}>
      {charts()}
      <LimitSlider limit={limit} setLimit={setLimit} />
    </Box>
  )
}

export default Chart
