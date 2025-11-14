import React, { useState } from 'react';
import { Alert, Button, FlatList, Text, TextInput, View } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createPost, deletePost, listFeed } from '../../src/api/posts';
import { addComment } from '../../src/api/comments';
import { toggleLike } from '../../src/api/likes';
import { PostCard } from '../../src/components/PostCard';
import { Loading } from '../../src/components/Loading';
import { ErrorView } from '../../src/components/ErrorView';
import { CommentItem } from '../../src/components/CommentItem';

const FeedScreen = () => {
  const [cursor, setCursor] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();
  const feedQuery = useQuery({ queryKey: ['feed', cursor], queryFn: () => listFeed(10, cursor ?? undefined) });

  const createMutation = useMutation({
    mutationFn: () => createPost({ content_md: content }),
    onSuccess: () => {
      setContent('');
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
    onError: (error) => Alert.alert('Post failed', error instanceof Error ? error.message : String(error)),
  });

  const likeMutation = useMutation({
    mutationFn: (postId: string) => toggleLike(postId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['feed'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (postId: string) => deletePost(postId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['feed'] }),
  });

  const commentMutation = useMutation({
    mutationFn: ({ postId, content: text }: { postId: string; content: string }) => addComment({ post_id: postId, content: text }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['feed'] }),
    onError: (error) => Alert.alert('Comment failed', error instanceof Error ? error.message : String(error)),
  });

  if (feedQuery.isLoading) {
    return <Loading />;
  }

  if (feedQuery.error) {
    return <ErrorView error={feedQuery.error} />;
  }

  const posts = feedQuery.data?.data ?? [];

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>Share an update</Text>
      <TextInput
        placeholder="How was training?"
        value={content}
        onChangeText={setContent}
        multiline
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, height: 80, marginBottom: 8 }}
      />
      <Button title="Post" onPress={() => createMutation.mutate()} disabled={!content.trim()} />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <PostCard
              post={{ ...item, like_count: item.likes?.length, comment_count: item.comments?.length }}
              onLike={() => likeMutation.mutate(item.id)}
              onDelete={() => deleteMutation.mutate(item.id)}
            />
            {item.comments?.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
            <TextInput
              placeholder="Add a comment"
              value={commentDrafts[item.id] ?? ''}
              onChangeText={(text) => setCommentDrafts((prev) => ({ ...prev, [item.id]: text }))}
              style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 8 }}
            />
            <Button
              title="Send"
              onPress={() => {
                const text = commentDrafts[item.id] ?? '';
                if (!text.trim()) return;
                commentMutation.mutate({ postId: item.id, content: text });
                setCommentDrafts((prev) => ({ ...prev, [item.id]: '' }));
              }}
            />
          </View>
        )}
        onEndReached={() => {
          if (feedQuery.data?.nextCursor) {
            setCursor(feedQuery.data.nextCursor);
          }
        }}
      />
    </View>
  );
};

export default FeedScreen;
