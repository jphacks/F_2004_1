import React, { FC, Dispatch, SetStateAction, ChangeEvent } from 'react'
import { Box, Slider, Typography } from '@material-ui/core'

type Props = {
  limit: number
  setLimit: Dispatch<SetStateAction<number>>
}

const LimitSlider: FC<Props> = (props: Props) => {
  const handleChange = (
    _: ChangeEvent<Record<string, never>>,
    value: number | number[]
  ): void => {
    const adjustedValue = (value as number) * 10 + 10
    props.setLimit(adjustedValue)
  }

  return (
    <Box>
      <Typography id="limit-slider">Period({props.limit})</Typography>
      <Slider
        value={(props.limit - 10) / 10}
        onChange={handleChange}
        aria-labelledby="limit-slider"
      />
    </Box>
  )
}

export default LimitSlider
