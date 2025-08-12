// src/hooks/useCarouselImages.ts
import { api } from '@lib/api';
import { useEffect, useState } from 'react';

export interface CarouselImage {
  id: string;
  url: string;
  link: string;
}

interface BannerData {
  id: string;
  title: string;
  subtitle?: string;
  url_imagem: string;
  link: string;
}

interface DataProps {
  banners: BannerData[];
}

interface DataFetchProps {
  content: DataProps;
}

interface UseCarouselImagesResult {
  images: CarouselImage[];
  loading: boolean;
  imageLoading: { [key: string]: boolean };
  handleImageLoad: (id: string) => void;
}

export function useCarouselImages(type: string): UseCarouselImagesResult {
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState<{ [key: string]: boolean }>(
    {}
  );

  useEffect(() => {
    async function fetchImages() {
      try {
        const response = await api.get<DataFetchProps>(
          `/cliente/banners_by_type?type=${type}&format=M`
        );

        const imagesData = response.data.content.banners;

        if (Array.isArray(imagesData)) {
          const adaptedData: CarouselImage[] = imagesData.map((item: any) => ({
            id: item.id,
            url: item.url_imagem, // adapta aqui!
            link: item.link,
          }));
          setImages(adaptedData);
          setImageLoading(
            adaptedData.reduce((acc, image) => {
              acc[image.id] = true;
              return acc;
            }, {} as { [key: string]: boolean })
          );
        } else {
          console.error('Formato inválido: imagens não recebidas como array');
        }
      } catch (error) {
        console.error('Erro ao buscar imagens:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
  }, [type]);

  const handleImageLoad = (id: string) => {
    setImageLoading((prev) => ({
      ...prev,
      [id]: false,
    }));
  };

  return { images, loading, imageLoading, handleImageLoad };
}
