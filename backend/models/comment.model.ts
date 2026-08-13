export interface CommentModel {
  id: string;
  taskId: string;
  userId: string;
  comment: string;
  createdAt: Date;
}

export interface CreateCommentData {
  comment: string;
  userId: string;
}
