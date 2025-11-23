import React, { useState } from 'react';
import { View, StyleSheet, Pressable, ActivityIndicator, Alert, TextInput as RNTextInput } from 'react-native';
import { Text } from '@components/index';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveAvaliacao } from '@services/details';
import { useAuth } from '@hooks/useAuth';
import styled from 'styled-components/native';

interface CommentInputProps {
  anuncioId: number;
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

const TextArea = styled(RNTextInput)`
  background-color: #F3F2ED;
  border-radius: 8px;
  width: 100%;
  min-height: 100px;
  padding: 10px;
  border: 1px solid transparent;
  font-family: 'MontserratRegular';
  color: #1A1E25;
`;

const CommentInput: React.FC<CommentInputProps> = ({ anuncioId }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);

  const { mutate: submitComment, isPending } = useMutation({
    mutationFn: saveAvaliacao,
    onSuccess: () => {
      Alert.alert('Sucesso', 'Comentário enviado com sucesso!');
      setComment('');
      setRating(5);
      
      queryClient.invalidateQueries({ queryKey: ['anuncio-details'] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Erro ao enviar comentário';
      Alert.alert('Erro', errorMessage);
    },
  });

  const handleSubmit = () => {
    if (!comment.trim()) {
      Alert.alert('Atenção', 'Por favor, escreva um comentário');
      return;
    }

    submitComment({
      id_anuncio: anuncioId,
      nota: rating,
      comentario: comment.trim(),
    });
  };

  if (!user || !user.id) {
    return null; 
  }

  const userName = user.nome || 'Usuário';
  const avatarColor = getAvatarColor(userName);
  const initials = getInitials(userName);

  return (
    <View style={styles.container}>
      <Text color="black-700" fontStyle="t-24" style={{ marginBottom: 16 }}>
        Deixe seu comentário
      </Text>
      
      <View style={styles.userInfo}>
        <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
          <Text color="white" fontStyle="p-14-bold">
            {initials}
          </Text>
        </View>
        <View style={styles.userDetails}>
          <Text color="black-500" fontStyle="p-14-bold">
            {userName}
          </Text>
        </View>
      </View>

      <View style={styles.ratingContainer}>
        <Text color="black-500" fontStyle="p-14-medium" style={{ marginBottom: 8 }}>
          Avaliação:
        </Text>
        <View style={styles.ratingStars}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Pressable
              key={star}
              onPress={() => setRating(star)}
              style={styles.starButton}
            >
              <Text
                color={star <= rating ? 'yellow' : 'gray-300'}
                fontStyle="c-18-bold"
              >
                ★
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.commentInputContainer}>
        <Text color="black-500" fontStyle="p-14-medium" style={{ marginBottom: 8 }}>
          Comentário
        </Text>
        <TextArea
          value={comment}
          onChangeText={setComment}
          placeholder="Escreva seu comentário sobre este anúncio..."
          placeholderTextColor="#64676D"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <Pressable
        style={[styles.submitButton, isPending && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={isPending}
      >
        {isPending ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text color="white" fontStyle="p-16-bold">
            Enviar comentário
          </Text>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
    backgroundColor: '#F9F8F5',
    borderRadius: 12,
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userDetails: {
    flex: 1,
  },
  ratingContainer: {
    gap: 8,
  },
  ratingStars: {
    flexDirection: 'row',
    gap: 8,
  },
  starButton: {
    padding: 4,
  },
  commentInputContainer: {
    width: '100%',
    gap: 8,
  },
  submitButton: {
    backgroundColor: '#9A0B26',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
});

export default CommentInput;

