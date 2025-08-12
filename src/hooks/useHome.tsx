import { useContext } from 'react'

import { HomeContext } from '@contexts/HomeContext'

export const useHome = () => {
  const context = useContext(HomeContext)

  return context
}
