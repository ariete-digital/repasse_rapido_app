import { fromCSS } from "@bacons/css-to-expo-linear-gradient"
import { LinearGradient } from "expo-linear-gradient"

const GradientLine = () => {
  return <LinearGradient
    {...fromCSS(
      `linear-gradient(90deg, rgba(0,30,71,1) 0%, rgba(63,114,175,1) 100%)`
    )}
    style={{
      width: '100%',
      height: 12
    }}
  ></LinearGradient>

}

export default GradientLine