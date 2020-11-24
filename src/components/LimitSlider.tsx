import React, { ChangeEvent, Dispatch, FC, SetStateAction } from 'react'
import { Box, Slider, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

type Props = {
  limit: number
  setLimit: Dispatch<SetStateAction<number>>
}

const useStyles = makeStyles(() => ({
  caption: {
    '& > b': {
      fontSize: '24px'
    }
  }
}))

const LimitSlider: FC<Props> = (props: Props) => {
  const classes = useStyles()

  const handleChange = (
    _: ChangeEvent<Record<string, never>>,
    value: number | number[]
  ): void => {
    const adjustedValue = (value as number) * 3 + 10
    props.setLimit(adjustedValue)
  }
  console.log(props.limit)
  return (
    <Box>
      <Typography id="limit-slider" className={classes.caption}>
        データの表示件数：<b>{props.limit}</b>件
      </Typography>
      <Slider
        value={(props.limit - 10) / 3}
        onChange={handleChange}
        aria-labelledby="limit-slider"
      />
    </Box>
  )
}

export default LimitSlider
