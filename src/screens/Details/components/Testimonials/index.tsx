import React from 'react';
import { View, Image, StyleSheet, ScrollView } from 'react-native';
import { Text } from '@components/index';

interface Testimonial {
  id: number;
  name: string;
  city: string;
  date: string;
  rating: number;
  avatar: string;
  text: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
}

const Testimonials: React.FC<TestimonialsProps> = ({ testimonials }) => {
  const avgRating = testimonials.length
    ? (
        testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length
      ).toFixed(1)
    : '0.0';

  return (
    <View style={styles.container}>
      <Text color="black-700" fontStyle="t-24">Depoimentos</Text>
      <View style={styles.headerRow}>
        <View style={styles.ratingBox}>
          <Text color='white' fontStyle='c-12-regular'>{testimonials.length} avaliações</Text>
          <View style={styles.rating}>
            <Text color='yellow' fontStyle='c-12-bold'>★ ★ ★ ★ ★</Text>
            <Text color='white' fontStyle='c-12-bold'>{avgRating}</Text>
          </View>
        </View>
        <View style={styles.recommendBox}>
          <Text color='white' fontStyle='p-14-bold'>{100}%</Text>
          <Text style={{width: 250}} color='white' fontStyle='c-12-regular'>dos compradores recomendam esta loja</Text>
        </View>
      </View>
      <View style={{ marginTop: 8 }}>
        {testimonials.map((item) => (
          <View style={styles.testimonial} key={item.id}>
            <View style={styles.count}>
              <Text color='yellow' fontStyle='p-14-bold'>★ ★ ★ ★ ★</Text>
              <Text color='black-500' fontStyle='p-14-bold'>{item.rating.toFixed(1)}</Text>
            </View>
            <Text color='black-500' fontStyle='c-12-medium'>{item.text}</Text>
            <View style={styles.row}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <View style={styles.info}>
                <Text  color='black-500' fontStyle='p-14-bold'>{item.name}</Text>
                <Text color='black-500' fontStyle='c-12-regular'>{item.city} | {item.date}</Text>
              </View>
            </View>
          </View>
        ))}
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
  info: {
    flex: 1,
  },
});

export default Testimonials;