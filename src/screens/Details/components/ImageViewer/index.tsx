import React, { useState } from 'react';
import {
  Modal,
  View,
  Image,
  Dimensions,
  Pressable,
  StatusBar,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';

const { width, height } = Dimensions.get('window');

interface ImageViewerProps {
  visible: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
}

const ImageViewer: React.FC<ImageViewerProps> = ({
  visible,
  onClose,
  images,
  initialIndex = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handleImagePress = () => {
    // Toggle zoom functionality can be added here
  };

  const goToNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <StatusBar hidden />
      <Container>
        <Header>
          <CloseButton onPress={onClose}>
            <MaterialIcons name="close" size={24} color="white" />
          </CloseButton>
          <ImageCounter>
            {currentIndex + 1} / {images.length}
          </ImageCounter>
        </Header>

        <ImageContainer>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / width);
              setCurrentIndex(index);
            }}
            contentOffset={{ x: currentIndex * width, y: 0 }}
          >
            {images.map((image, index) => (
              <View key={index}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  maximumZoomScale={3}
                  minimumZoomScale={1}
                  style={{ flex: 1 }}
                  contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                >
                  <Pressable onPress={handleImagePress}>
                    <FullScreenImage
                      source={{ uri: image }}
                      resizeMode="contain"
                    />
                  </Pressable>
                </ScrollView>
              </View>
            ))}
          </ScrollView>
        </ImageContainer>

        {images.length > 1 && (
          <NavigationContainer>
            <NavigationButton
              onPress={goToPrevious}
              disabled={currentIndex === 0}
            >
              <MaterialIcons 
                name="chevron-left" 
                size={30} 
                color={currentIndex === 0 ? "#666" : "white"} 
              />
            </NavigationButton>
            
            <NavigationButton
              onPress={goToNext}
              disabled={currentIndex === images.length - 1}
            >
              <MaterialIcons 
                name="chevron-right" 
                size={30} 
                color={currentIndex === images.length - 1 ? "#666" : "white"} 
              />
            </NavigationButton>
          </NavigationContainer>
        )}
      </Container>
    </Modal>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: black;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  padding-top: 50px;
`;

const CloseButton = styled.Pressable`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

const ImageCounter = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

const ImageContainer = styled.View`
  flex: 1;
  flex-direction: column;
  max-height: ${height - 260}px;
  justify-content: center;
  align-items: center;
`;

const FullScreenImage = styled.Image`
  width: ${width}px;
  height: ${height - 120}px;
`;

const NavigationContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 20px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`;

const NavigationButton = styled.Pressable`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

export default ImageViewer; 