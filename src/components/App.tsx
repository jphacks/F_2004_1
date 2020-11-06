import React, { FC, useEffect, useState } from 'react'
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'
import { ConcentrationValue } from '../types'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { formatToHMS } from '../utils'
import { Box } from '@material-ui/core'
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

  const [concentrationValues, setConcentrationValues] = useState<
    ConcentrationValue[]
  >()
  const [limit, setLimit] = useState<number>(100)
  // const [userId, setUserId] = useState<number>()

  useEffect(() => {
    // const date = ""
    const userId = '1'
    const endpoint = `${process.env.REACT_APP_API_URL}/concentration_values/${userId}?limit=${limit}`
    console.log(endpoint)

    fetch(endpoint)
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status !== 'success')
          throw Error('Response status is not success')

        const concentrationValues: ConcentrationValue[] = responseJson.concentration_values
          .slice(0, limit)
          .map((data: Record<string, never>) => {
            const datetime = new Date(data.created_at)
            const concentrationValue = data.concentration_value
            const isSitting = data.is_sitting

            return {
              datetime: formatToHMS(datetime),
              concentrationValue: concentrationValue,
              isSitting: isSitting
            }
          })

        setConcentrationValues(concentrationValues.reverse())
      })
      .catch(error => console.log(error))
  }, [limit])

  return (
    <Box className={classes.root}>
      <h1 className={classes.title}>How you concentrated</h1>
      <LineChart
        width={1000}
        height={500}
        data={concentrationValues}
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
      <LimitSlider limit={limit} setLimit={setLimit} />
    </Box>
  )
}

export default App
