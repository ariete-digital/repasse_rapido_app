import Text from '@components/Text'
import * as M from './styles'

interface MoreInfoProps {
  onPress: () => void
}

const MoreInfo = ({ onPress }: MoreInfoProps) => {
  return (
    <M.Container onPress={onPress}>
      <Text color="white" fontStyle='p-14-bold'>Saiba Mais</Text>
    </M.Container>
  )
}
export default MoreInfo