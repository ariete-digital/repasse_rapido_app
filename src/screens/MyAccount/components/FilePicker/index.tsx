import Text from '@components/Text'
import * as DocumentPicker from 'expo-document-picker'
import React, { useState } from 'react'
import { Alert } from 'react-native'
import * as FP from './styles'

interface ImgPickerProps {
  onImageSelected?: (uri: string | null, fileName?: string, mimeType?: string) => void;
  label?: string;
}

export default function ImgPicker({ onImageSelected, label = 'Arquivos' }: ImgPickerProps) {
  const [image, setImage] = useState<null | string>(null)
  const [fileName, setFileName] = useState<null | string>(null)

  const getMimeType = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    
    const mimeTypes: { [key: string]: string } = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'pdf': 'application/pdf',
      'webp': 'image/webp',
    }
    
    return mimeTypes[extension || ''] || 'application/octet-stream'
  }

  const extractFileName = (uri: string): string => {
    // Extrai o nome do arquivo da URI
    const parts = uri.split('/')
    const file = parts[parts.length - 1]
    
    if (file && file.includes('.')) {
      return file
    }
    
    const lastPart = uri.substring(uri.lastIndexOf('/') + 1)
    if (lastPart && lastPart.length > 0) {
      return lastPart.length > 30 ? `${lastPart.substring(0, 30)}...` : lastPart
    }
    
    return 'arquivo'
  }

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      })

      // Na versão 11 do expo-document-picker, o resultado tem um array assets
      if (result && !result.canceled && (result as any).assets && (result as any).assets.length > 0) {
        const asset = (result as any).assets[0]
        const fileUri = asset.uri
        const name = asset.name || extractFileName(fileUri)
        const mimeType = asset.mimeType || getMimeType(name)
        
        setImage(fileUri)
        setFileName('Arquivo selecionado')
        
        if (onImageSelected) {
          onImageSelected(fileUri, name, mimeType)
        }
      }
    } catch (error: any) {
      if (error && error.code === 'E_DOCUMENT_PICKER_CANCELED') {
        return
      }
      console.error('Erro ao selecionar documento:', error)
      Alert.alert('Erro', 'Não foi possível selecionar o documento. Tente novamente.')
    }
  }

  return (
    <FP.Container>
      <FP.PickerBTN onPress={pickDocument}>
        <Text color="white" fontStyle="p-14-bold">
          Arquivos
        </Text>
      </FP.PickerBTN>
      <FP.ImagePathContainer>
        {fileName ? (
          <FP.ImagePathLabel color="black" fontStyle="p-12-regular" numberOfLines={1}>
            {fileName}
          </FP.ImagePathLabel>
        ) : (
          <FP.ImagePathLabel color="gray" fontStyle="p-12-regular">
            Nenhum arquivo selecionado
          </FP.ImagePathLabel>
        )}
      </FP.ImagePathContainer>
    </FP.Container>
  )
}
