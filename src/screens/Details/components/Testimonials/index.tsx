import React from 'react';
import { View, Image, StyleSheet, ScrollView } from 'react-native';
import { Text } from '@components/index';

interface Testimonial {
  id: number;
  
  nome_cliente?: string;
  nota?: number | null;
  comentario?: string;
  data?: string;
  
  name?: string;
  city?: string;
  date?: string;
  rating?: number | null;
  avatar?: string | null;
  text?: string;
}

const getAvatarColor = (name: string): string => {
  const colors = [
    '#E11138', 
    '#001E47', 
    '#E3B505', 
    '#9A0B26', 
    '#25513C', 
    '#38AE76', 
    '#CE7720', 
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

const getInitials = (name: string): string => {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0][0].toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

interface TestimonialsProps {
  testimonials: Testimonial[];
}

const Testimonials: React.FC<TestimonialsProps> = ({ testimonials }) => {
  
  const normalizedTestimonials = testimonials.map(t => ({
    id: t.id,
    name: t.nome_cliente || t.name || 'Usuário',
    nota: t.nota ?? t.rating ?? null,
    comentario: t.comentario || t.text || '',
    data: t.data || t.date || '',
    city: t.city || '',
    avatar: t.avatar || null,
  }));

  const validTestimonials = normalizedTestimonials.filter(t => {
    const rating = t.nota;
    return rating !== undefined && rating !== null && !isNaN(Number(rating));
  });
  
  const avgRating = validTestimonials.length > 0
    ? (
        validTestimonials.reduce((acc, t) => {
          const rating = t.nota ?? 0;
          return acc + Number(rating);
        }, 0) / validTestimonials.length
      ).toFixed(1)
    : '0.0';

  const renderStars = (rating: number | undefined | null) => {
    if (rating === undefined || rating === null || isNaN(Number(rating))) {
      rating = 0;
    }
    const numRating = Number(rating);
    const fullStars = Math.floor(numRating);
    const hasHalfStar = numRating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <View style={{ flexDirection: 'row' }}>
        
        {Array.from({ length: fullStars }, (_, i) => (
          <Text key={`full-${i}`} color='yellow' fontStyle='c-12-bold'>★</Text>
        ))}
        
        {hasHalfStar && (
          <Text color='yellow' fontStyle='c-12-bold'>☆</Text>
        )}
        
        {Array.from({ length: emptyStars }, (_, i) => (
          <Text key={`empty-${i}`} color='gray-300' fontStyle='c-12-bold'>☆</Text>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text color="black-700" fontStyle="t-24">Depoimentos</Text>
      <View style={styles.headerRow}>
        <View style={styles.ratingBox}>
          <Text color='white' fontStyle='c-12-regular'>{validTestimonials.length} avaliações</Text>
          <View style={styles.rating}>
            {renderStars(parseFloat(avgRating))}
            <Text color='white' fontStyle='c-12-bold'>{avgRating}</Text>
          </View>
        </View>
        {validTestimonials.length > 0 && (
          <View style={styles.recommendBox}>
            <Text color='white' fontStyle='p-14-bold'>{100}%</Text>
            <Text style={{width: 250}} color='white' fontStyle='c-12-regular'>dos compradores recomendam esta loja</Text>
          </View>
        )}
      </View>
      <View style={{ marginTop: 8 }}>
        {validTestimonials.map((item) => {
          const rating = item.nota ?? 0;
          const commentText = item.comentario || '';
          const userName = item.name || 'Usuário';
          const userCity = item.city || '';
          const userDate = item.data || '';
          
          return (
            <View style={styles.testimonial} key={item.id}>
              <View style={styles.count}>
                {renderStars(rating)}
                <Text color='black-500' fontStyle='p-14-bold'>
                  {Number(rating).toFixed(1)}
                </Text>
              </View>
              <Text color='black-500' fontStyle='c-12-medium'>{commentText}</Text>
              <View style={styles.row}>
                {item.avatar ? (
                  <Image source={{ uri: item.avatar }} style={styles.avatar} />
                ) : (
                  <View style={[styles.avatar, styles.avatarPlaceholder, { backgroundColor: getAvatarColor(userName) }]}>
                    <Text color='white' fontStyle='p-14-bold'>
                      {getInitials(userName)}
                    </Text>
                  </View>
                )}
                <View style={styles.info}>
                  <Text color='black-500' fontStyle='p-14-bold'>{userName}</Text>
                  {userDate && (
                    <Text color='black-500' fontStyle='c-12-regular'>
                      {userDate}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 20,
  },
  headerRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: '#9A0B26',
    borderRadius: 8,
    padding: 12,
    gap: 10
  },
  ratingBox: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recommendBox: {
    flex: 1,
    flexDirection: 'row',
    gap: 3,
    alignItems: 'baseline',
  },
  recommendPercent: {
    color: '#C00',
    fontWeight: 'bold',
    fontSize: 16,
  },
  recommendText: {
    color: '#222',
    fontSize: 13,
  },
  count: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  testimonial: {
    backgroundColor: '#F9F8F5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    gap: 16
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
});

export default Testimonials;