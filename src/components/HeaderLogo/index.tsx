import { Image } from 'react-native'

import logo from '../../assets/images/logo.png'

export const HeaderLogo = () => {
  return (
    <Image
      source={logo}
      resizeMethod="auto"
    />
  )
}

export default HeaderLogo
