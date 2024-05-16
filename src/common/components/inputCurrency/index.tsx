import { forwardRef, useImperativeHandle, useRef } from 'react'
import { NumericFormat } from 'react-number-format'
import { Typography } from 'antd'

type PositiveFloatNumInputProps = {
  inputAmount?: string
  className?: string
  isDisabled?: boolean
  placeholder?: string
  min?: number
  max?: number
  maxDecimals?: number
  onInputChange?: (e: any) => void
  onAmountChange?: (a: number) => void
  prefix?: string
  suffix?: string
  label?: string
  showCommas?: boolean
}

const MIN_DEFAULT = 0.00000001
const MAX_DEFAULT = Number.MAX_SAFE_INTEGER
const MAX_DECIMALS_DEFAULT = 9

const InputCurrency = forwardRef<HTMLInputElement, PositiveFloatNumInputProps>(
  (
    {
      inputAmount,
      isDisabled = false,
      label = '',
      min = MIN_DEFAULT,
      max = MAX_DEFAULT,
      maxDecimals = MAX_DECIMALS_DEFAULT,
      onInputChange = () => {},
      className,
      placeholder = '0.00',
      prefix,
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null)
    useImperativeHandle(ref, () => inputRef.current!)

    return (
      <div className={'flex  items-center w-full rounded-[8px]'}>
        <NumericFormat
          className={`${className} input-format  w-full text-lg text-[#344054] font-medium`}
          aria-label={label}
          value={inputAmount}
          displayType="input"
          decimalScale={maxDecimals}
          placeholder={placeholder}
          decimalSeparator={'.'}
          isAllowed={(values) => {
            const { formattedValue, floatValue } = values
            return formattedValue === '' || Number(floatValue) <= max
          }}
          onValueChange={(values: any) => {
            if (Number(values.floatValue) > max) {
              onInputChange(max)
            } else {
              onInputChange(values.floatValue)
            }
          }}
          disabled={isDisabled}
        />
      </div>
    )
  },
)

export default InputCurrency
