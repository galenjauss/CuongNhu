import React from 'react';
import { Text, View } from 'react-native';
import type { Comment } from '../api/types';

export const CommentItem: React.FC<{ comment: Comment }> = ({ comment }) => (
  <View style={{ paddingVertical: 4 }}>
    <Text style={{ fontWeight: '600' }}>{comment.author_id}</Text>
    <Text>{comment.content}</Text>
  </View>
);
