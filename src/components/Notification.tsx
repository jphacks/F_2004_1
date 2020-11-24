import React, { FC, useCallback, useEffect, useState } from 'react'
import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

interface Props {
  concentrationValues: number[]
}

const useStyles = makeStyles(() => ({
  text: {
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: 'bold'
  }
}))

const Notification: FC<Props> = (props: Props) => {
  const classes = useStyles()

  const [text, setText] = useState<string>('')

  const createNotificationText = useCallback(
    (values: number[]): string => {
      if (props.concentrationValues.length === 0) return ''

      const average: number =
        values.reduce(
          (accumulator: number, current: number) => accumulator + current
        ) / values.length

      if (average > 9) return '集中力が神の域に達しています(((o(*ﾟ▽ﾟ*)o)))'
      if (average > 7) return 'かなりいい集中力です٩(ˊᗜˋ*)و♪'
      if (average > 4) return 'まぁまぁの集中力です(*´∀｀)'
      if (average > 1) return '集中力が下がっていますよΣ(ﾟﾛﾟ;)'
      return '一度休みませんか...？(´×ω×`)'
    },
    [props.concentrationValues.length]
  )

  useEffect(() => {
    setText(
      createNotificationText(props.concentrationValues.reverse().slice(0, 10))
    )
  }, [createNotificationText, props.concentrationValues])

  return <Typography className={classes.text}>{text}</Typography>
}

export default Notification
