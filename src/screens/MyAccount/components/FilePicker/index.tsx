import Text from '@components/Text'
import * as ImagePicker from 'expo-image-picker'
import React, { useState } from 'react'
import * as FP from './styles'

export default function ImgPicker() {
  const [image, setImage] = useState<null | string>(null)

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
  }

  return (
    <FP.Container>
      <FP.PickerBTN onPress={pickImage}>
        <Text color="white" fontStyle="p-14-bold">
          Arquivos
        </Text>
      </FP.PickerBTN>
      <FP.ImagePathContainer>
        {image && (
          <FP.ImagePathLabel color="black">
            {JSON.stringify(image)}
          </FP.ImagePathLabel>
        )}
      </FP.ImagePathContainer>
    </FP.Container>
  )
}
