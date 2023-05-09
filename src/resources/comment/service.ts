import { CommentDocument, Comment } from './interface';
import { Connection, Model } from 'mongoose';
import { MODEL_NAMES } from '@utils/constants';

class CommentService {
  private comment: Model<Comment>;

  constructor(db: Connection) {
    this.comment = db.model(MODEL_NAMES.comment);
  }

  /**
   * @param comment document to add new comment to a prescription
   * @returns  Created comment
   */
  public async create(comment: Comment) {
    const newComment: CommentDocument = await this.comment.create(comment);
    return newComment;
  }

  /**
   * @returns comments list
   */

  public async list(query?: Record<string, any>): Promise<CommentDocument[]> {
    const comments: CommentDocument[] = await this.comment.find({
      ...query,
    });
    return comments;
  }
}

export default CommentService;
