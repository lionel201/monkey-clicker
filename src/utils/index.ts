import { Account } from '@aptos-labs/ts-sdk'

export const formatNumberBalance = (number: number | string = '0', infractionDigit: number = 4) => {
  let formatPrice = ''
  if (Number(number) > 0 && Number(number) < 0.0001) {
    formatPrice = '<0.0001'
  } else if (Number(number) > 0 && Number(number) < 0.01) {
    formatPrice = '<0.01'
  } else if (Number(number) === 0) {
    formatPrice = '0'
  } else if (isNaN(Number(number))) {
    formatPrice = '0'
  } else if (Number(number) < 0.000001) {
    formatPrice = '< 0.0001'
  } else {
    if (Number.isInteger(Number(number))) {
      formatPrice = Number(Number(number)).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
      return formatPrice
    }
    const indexOf = String(number).indexOf('.') || -1
    const newNumber = Number(String(number).slice(0, indexOf + infractionDigit + 1))
    formatPrice = Number(Number(newNumber)).toLocaleString('en-US', {
      minimumFractionDigits: infractionDigit,
      maximumFractionDigits: infractionDigit,
    })
  }
  return formatPrice
}

export function ellipseAddress(address: string = '', width: number = 10): string {
  return `${String(address).slice(0, width)}...${String(address).slice(-width)}`
}

export const copyToClipboard = (text: string) => {
  const textField = document.createElement('textarea')
  textField.innerText = text
  document.body.appendChild(textField)
  textField.select()
  document.execCommand('copy')
  textField.remove()
}
