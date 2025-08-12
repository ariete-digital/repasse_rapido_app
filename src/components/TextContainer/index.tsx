import React from 'react'
import * as T from './styles'

interface TextContainerProps extends T.ContainerProps {
  children: React.ReactElement[] | React.ReactElement
}

const TextContainer = ({ children, ...props }: TextContainerProps) => {
  return <T.Container {...props}>{children}</T.Container>
}

export default TextContainer
