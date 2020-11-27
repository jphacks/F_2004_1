import React, {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useState
} from 'react'
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts'
import { ConcentrationValue, User } from '../types'
import { makeStyles } from '@material-ui/core/styles'
import { Box } from '@material-ui/core'
import { createErrorMessage, formatToHM } from '../utils'
import useInterval from 'use-interval'
import Notification from './Notification'

interface Props {
  userId: string
  limit: number
  setUser: Dispatch<SetStateAction<User | undefined>>
}

const useStyles = makeStyles(() => ({
  barChart: {
    margin: '0 auto'
  }
}))

const Chart: FC<Props> = (props: Props) => {
  const classes = useStyles()

  const apiUrl = process.env.REACT_APP_API_URL
  const userId: number = parseInt(props.userId)

  const limit = props.limit
  const setUser = props.setUser
  const [concentrationValues, setConcentrationValues] = useState<
    ConcentrationValue[]
  >([])

  const fetchUser = useCallback(
    async (endpoint: string, userId: number): Promise<User> => {
      const response = await fetch(`${endpoint}/${userId}`)
      const json = await response.json()

      if (json.status != 'success') {
        throw Error(createErrorMessage(json.status, json.message))
      }

      return json.user
    },
    []
  )
  useEffect(() => {
    fetchUser(`${apiUrl}/users`, userId)
      .then((user: User) => setUser(user))
      .catch(error => console.log(error))
  }, [apiUrl, fetchUser, limit, setUser, userId])

  const fetchConcentrationValues = useCallback(
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
              datetime: formatToHM(datetime),
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
    fetchConcentrationValues(`${apiUrl}/concentration_values`, userId, limit)
      .then((concentrationValues: ConcentrationValue[]) =>
        setConcentrationValues(concentrationValues)
      )
      .catch(error => console.log(error))
  }, [apiUrl, fetchConcentrationValues, fetchUser, limit, userId])

  useInterval(
    () =>
      fetchConcentrationValues(`${apiUrl}/concentration_values`, userId, limit)
        .then((concentrationValues: ConcentrationValue[]) =>
          setConcentrationValues(concentrationValues)
        )
        .catch(error => console.log(error)),
    1000
  )

  return (
    <Box>
      <BarChart
        width={1000}
        height={300}
        data={concentrationValues}
        className={classes.barChart}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="datetime"
          label={{
            value: 'Time',
            position: 'insideBottomRight',
            fontSize: 20
          }}
          height={50}
        />
        <YAxis
          type="number"
          domain={[0, 10]}
          label={{
            value: 'Concentration',
            angle: -90,
            fontSize: 20
          }}
          width={80}
        />
        <Tooltip formatter={value => [value, 'concentration']} />
        <Bar
          dataKey="concentrationValue"
          fill="#18B861"
          isAnimationActive={false}
        />
      </BarChart>
      <Notification
        concentrationValues={concentrationValues.map(
          (value: ConcentrationValue) => value.concentrationValue
        )}
      />
    </Box>
  )
}

export default Chart
