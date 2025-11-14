export type MemberRole = 'student' | 'instructor' | 'admin';
export type NotificationType = 'like' | 'comment' | 'new_post' | 'system';

export interface Profile {
  user_id: string;
  display_name: string;
  photo_url: string | null;
  rank: string | null;
  dojo_default: string | null;
  bio: string | null;
  expo_push_token: string | null;
  created_at: string;
  updated_at: string;
}

export interface Dojo {
  id: string;
  name: string;
  location: string | null;
  description: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface DojoMember {
  dojo_id: string;
  user_id: string;
  role: MemberRole;
  joined_at: string;
  profiles?: Profile;
}

export interface Curriculum {
  id: string;
  title: string;
  description: string | null;
  dojo_id: string | null;
  is_public: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  curriculum_id: string;
  title: string;
  content_md: string | null;
  media_urls: string[];
  order_index: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface TrainingLog {
  id: string;
  user_id: string;
  dojo_id: string | null;
  date: string;
  duration_min: number | null;
  focus: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface TeachingLog {
  id: string;
  user_id: string;
  dojo_id: string | null;
  date: string;
  duration_min: number | null;
  topic: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  title: string | null;
  content_md: string | null;
  mood: string | null;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  author_id: string;
  dojo_id: string | null;
  content_md: string | null;
  media_urls: string[];
  created_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
}

export interface Like {
  post_id: string;
  user_id: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  data: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}

export interface FeedPost extends Post {
  profiles?: Profile;
  comments?: Comment[];
  likes?: Like[];
  like_count?: number;
  comment_count?: number;
  viewer_has_liked?: boolean;
}

export interface CurriculumWithLessons extends Curriculum {
  lessons: Lesson[];
}

export interface TrainingSummary {
  month: string;
  minutes: number;
}
