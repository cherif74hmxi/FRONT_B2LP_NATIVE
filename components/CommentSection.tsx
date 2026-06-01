import { StyleSheet, Text, TextInput, View } from "react-native";
import type { Billet } from "./types";
import {
  ActionButton,
  MessageBox,
  formatDate,
  getCommentAuthorName,
  palette,
  sharedStyles,
} from "./ui";

type CommentSectionProps = {
  billet: Billet;
  commentContent: string;
  commentError?: string;
  commentSuccess?: string;
  deletingCommentId?: number;
  isAdmin: boolean;
  isSubmittingComment: boolean;
  onChangeComment: (value: string) => void;
  onCreateComment: () => void;
  onDeleteComment: (id: number) => void;
};

export default function CommentSection({
  billet,
  commentContent,
  commentError,
  commentSuccess,
  deletingCommentId,
  isAdmin,
  isSubmittingComment,
  onChangeComment,
  onCreateComment,
  onDeleteComment,
}: CommentSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Commentaires</Text>

      {billet.Commentaires && billet.Commentaires.length > 0 ? (
        <View style={styles.commentList}>
          {billet.Commentaires.map((commentaire, index) => (
            <View
              style={sharedStyles.smallCard}
              key={commentaire.id || index}
            >
              <Text style={styles.commentAuthor}>
                {getCommentAuthorName(commentaire)}
              </Text>
              <Text style={styles.commentDate}>
                {formatDate(commentaire.Date)}
              </Text>
              <Text style={styles.commentContent}>
                {commentaire.Contenu}
              </Text>

              {isAdmin ? (
                <ActionButton
                  icon="trash"
                  label="Supprimer le commentaire"
                  loading={deletingCommentId === commentaire.id}
                  onPress={() => onDeleteComment(commentaire.id)}
                  variant="danger"
                />
              ) : null}
            </View>
          ))}
        </View>
      ) : (
        <Text style={sharedStyles.helperText}>
          Aucun commentaire pour ce billet.
        </Text>
      )}

      <View style={sharedStyles.smallCard}>
        <Text style={sharedStyles.label}>Ajouter un commentaire</Text>
        <TextInput
          multiline
          onChangeText={onChangeComment}
          placeholder="Votre commentaire"
          placeholderTextColor={palette.muted}
          style={[sharedStyles.input, sharedStyles.multilineInput]}
          textAlignVertical="top"
          value={commentContent}
        />

        {commentError ? <MessageBox message={commentError} tone="error" /> : null}
        {commentSuccess ? (
          <MessageBox message={commentSuccess} tone="success" />
        ) : null}

        <ActionButton
          disabled={!commentContent.trim()}
          icon="send"
          label="Publier"
          loading={isSubmittingComment}
          onPress={onCreateComment}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 14,
  },
  title: {
    color: palette.text,
    fontSize: 24,
    fontWeight: "900",
  },
  commentList: {
    gap: 12,
  },
  commentAuthor: {
    color: palette.purple,
    fontSize: 14,
    fontWeight: "900",
  },
  commentDate: {
    color: palette.muted,
    fontSize: 12,
  },
  commentContent: {
    color: palette.text,
    fontSize: 16,
    lineHeight: 24,
  },
});
