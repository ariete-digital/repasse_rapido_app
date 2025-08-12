import * as T from './styles'

const Text = ({ children, ...props }: T.TextElementProps) => {
  return <T.TextElement {...props}>{children}</T.TextElement>
}

export default Text
