import React from 'react';
import { Button, Text, View } from 'react-native';
import type { FeedPost } from '../api/types';

export const PostCard: React.FC<{
  post: FeedPost;
  onLike?: () => void;
  onComment?: () => void;
  onDelete?: () => void;
}> = ({ post, onLike, onComment, onDelete }) => {
  return (
    <View style={{ borderWidth: 1, borderColor: '#eee', padding: 12, marginBottom: 12, borderRadius: 8 }}>
      <Text style={{ fontWeight: '700' }}>{post.profiles?.display_name ?? 'Member'}</Text>
      <Text style={{ marginVertical: 8 }}>{post.content_md}</Text>
      <Text style={{ color: '#666' }}>
        {post.like_count ?? post.likes?.length ?? 0} likes · {post.comment_count ?? post.comments?.length ?? 0} comments
      </Text>
      <View style={{ flexDirection: 'row', marginTop: 8, gap: 8 }}>
        {onLike ? <Button title="Like" onPress={onLike} /> : null}
        {onComment ? <Button title="Comment" onPress={onComment} /> : null}
        {onDelete ? <Button title="Delete" onPress={onDelete} color="red" /> : null}
      </View>
    </View>
  );
};
