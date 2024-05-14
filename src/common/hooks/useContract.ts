import useClient from '@/common/hooks/useClient'

interface ViewRequests {
  function: string
  typeArguments: any[]
  functionArguments: any[]
}

const useContract = () => {
  const { aptos } = useClient()

  const view = async (payload: any) => {
    return await aptos.view({ payload })
  }

  return { view }
}

export default useContract
