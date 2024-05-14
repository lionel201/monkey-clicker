import { Button, Modal } from 'antd'
import React from 'react'

interface Props {
  isModalOpen: boolean
  handleClose: () => void
  onOk: () => void
  loading: boolean
}

export const ModalWarningImportWallet: React.FunctionComponent<Props> = ({
  isModalOpen,
  handleClose,
  onOk,
  loading,
}) => {
  return (
    <Modal onCancel={handleClose} centered visible={isModalOpen} footer={false} closable={false} width={450}>
      <div className="text-center text-[#000]">
        <h1 className="text-yellow-400 font-semibold text-lg text-center ">WARNING</h1>
        <p className="mt-5">This will delete and replace your current wallet.</p>
        <p className="mt-3">Are you sure?</p>
      </div>
      <div className="flex justify-center mt-8 gap-2">
        <Button
          loading={loading}
          disabled={loading}
          onClick={onOk}
          className="min-w-[90px] bg-[#CA5C3B] text-[#fff] border-0 rounded-[100px] h-10"
        >
          OK
        </Button>
        <Button
          onClick={handleClose}
          className="min-w-[90px] border-[#CA5C3B] text-[#CA5C3B] bg-transparent rounded-[100px] h-10"
        >
          Cancel
        </Button>
      </div>
    </Modal>
  )
}
