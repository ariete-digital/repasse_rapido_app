// src/components/Carousel.tsx
import { CarouselImage, useCarouselImages } from '@hooks/useBanners';
import { openUrl } from '@utils/index';
import React, { useEffect, useRef, useState } from 'react';
import { Image as ExpoImage } from 'expo-image';
import {
  View,
  FlatList,
  Animated,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import styled from 'styled-components/native';

const { width } = Dimensions.get('window');

interface CarouselProps {
  type: string;
}

const CarouselContainer = styled.View`
  height: 110px;
`;

const SkeletonContainer = styled.View`
  width: ${width}px;
  height: 110px;
  background-color: #e0e0e0;
  align-items: center;
  justify-content: center;
`;

const LoadingContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const CarouselBanners: React.FC<CarouselProps> = ({ type }) => {
  const { images, loading, imageLoading, handleImageLoad } =
    useCarouselImages(type);
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current; // opacidade
  const scaleAnim = useRef(new Animated.Value(0.95)).current; // scale leve

  useEffect(() => {
    const timer = setInterval(() => {
      if (images.length > 0) {
        let nextIndex = (currentIndex + 1) % images.length;
        setCurrentIndex(nextIndex);

        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });

        fadeAnim.setValue(0);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex, images.length, fadeAnim]);

  const handlePressImage = (link: string) => {
    if (link) {
      openUrl(link);
    }
  };

  const onImageLoadEnd = (id: string) => {
    handleImageLoad(id); // informa para o hook que carregou

    // Agora anima a imagem
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const renderItem = ({ item }: { item: CarouselImage }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handlePressImage(item.link)}
      >
        <View
          style={{
            position: 'relative',
            width: width,
            height: 110,
          }}
        >
          {imageLoading[item.id] && (
            <SkeletonContainer>
              <ActivityIndicator size="large" color="#999" />
            </SkeletonContainer>
          )}
          <Animated.Image
            source={{ uri: item.url }}
            onError={(e) =>
              console.log('Erro carregando imagem:', e.nativeEvent)
            }
            resizeMode="contain"
            style={{
              width: width,
              height: 110,
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
              position: 'absolute',
            }}
            onLoadEnd={() => onImageLoadEnd(item.id)}
          />
          <Animated.View
            style={{
              width,
              height: 110,
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
              position: 'absolute',
            }}
          >
            <ExpoImage
              source={item.url}
              style={{ width, height: 110 }}
              contentFit="contain"
              cachePolicy="memory-disk"
              onLoadEnd={() => onImageLoadEnd(item.id)}
              onError={(e: any) =>
                console.log('Erro carregando imagem:', e.nativeEvent)
              }
            />
          </Animated.View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color="#000" />
      </LoadingContainer>
    );
  }

  return (
    <CarouselContainer>
      <FlatList
        ref={flatListRef}
        data={images}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      />
    </CarouselContainer>
  );
};
