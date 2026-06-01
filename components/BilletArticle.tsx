import { StyleSheet, Text, View } from "react-native";
import type { Billet } from "./types";
import {
  ActionButton,
  formatDate,
  getBilletAuthorName,
  palette,
  sharedStyles,
} from "./ui";

type BilletArticleProps = {
  billet: Billet;
  isAdmin: boolean;
  isDeleting: boolean;
  onDelete: () => void;
  onEdit: () => void;
};

export default function BilletArticle({
  billet,
  isAdmin,
  isDeleting,
  onDelete,
  onEdit,
}: BilletArticleProps) {
  return (
    <View style={sharedStyles.card}>
      <Text style={styles.title}>{billet.Titre}</Text>
      <Text style={styles.meta}>
        Cree le {formatDate(billet.Date)} par {getBilletAuthorName(billet.Auteur)}
      </Text>
      <Text style={styles.content}>{billet.Contenu}</Text>

      {isAdmin ? (
        <View style={styles.adminActions}>
          <ActionButton
            icon="pencil"
            label="Modifier"
            onPress={onEdit}
            variant="cyan"
          />
          <ActionButton
            icon="trash"
            label="Supprimer"
            loading={isDeleting}
            onPress={onDelete}
            variant="danger"
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: palette.cyan,
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 36,
  },
  meta: {
    color: palette.muted,
    fontSize: 12,
    lineHeight: 20,
  },
  content: {
    color: palette.text,
    fontSize: 16,
    lineHeight: 24,
  },
  adminActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: palette.border,
    paddingTop: 12,
  },
});
