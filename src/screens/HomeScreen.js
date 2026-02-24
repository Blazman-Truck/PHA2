import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, SafeAreaView,
} from 'react-native';
import { colors } from '../theme';

export default function HomeScreen({ savedHands, onNew, onEdit, onAnalyze, onDelete }) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgDeep} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>POKER HAND LOG</Text>
        <Text style={styles.headerSuit}>♣♦♥♠</Text>
        <TouchableOpacity style={styles.newBtn} onPress={onNew} activeOpacity={0.75}>
          <Text style={styles.newBtnText}>+ NEW</Text>
        </TouchableOpacity>
      </View>

      {savedHands.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptySuit}>♣  ♦  ♥  ♠</Text>
          <Text style={styles.emptyText}>No hands saved yet.{'\n'}Tap below to log your first hand.</Text>
          <TouchableOpacity style={styles.emptyBtn} onPress={onNew} activeOpacity={0.8}>
            <Text style={styles.emptyBtnText}>LOG A HAND</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {savedHands.map((h, i) => (
            <View key={h.id} style={styles.card}>
              {/* Card meta row */}
              <View style={styles.cardMeta}>
                <Text style={styles.cardNum}>HAND #{savedHands.length - i}</Text>
                {h.analysis ? (
                  <View style={styles.analyzedBadge}>
                    <Text style={styles.analyzedBadgeText}>● ANALYZED</Text>
                  </View>
                ) : null}
                <Text style={styles.cardTime}>{h.date} · {h.time}</Text>
              </View>

              {/* Hand text */}
              <Text style={styles.cardText}>{h.text}</Text>

              {/* Action buttons */}
              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.editBtn]}
                  onPress={() => onEdit(h)}
                  activeOpacity={0.75}
                >
                  <Text style={styles.editBtnText}>EDIT</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.analyzeBtn]}
                  onPress={() => onAnalyze(h)}
                  activeOpacity={0.75}
                >
                  <Text style={styles.analyzeBtnText}>ANALYZE</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.deleteBtn]}
                  onPress={() => onDelete(h.id)}
                  activeOpacity={0.75}
                >
                  <Text style={styles.deleteBtnText}>DELETE</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },

  header: {
    backgroundColor: colors.bgDeep,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    flex: 1,
    color: colors.green,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 3,
  },
  headerSuit: { color: colors.green, opacity: 0.25, fontSize: 13, letterSpacing: 3 },
  newBtn: {
    backgroundColor: colors.greenDark,
    borderWidth: 1,
    borderColor: colors.green,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  newBtnText: { color: colors.white, fontSize: 13, fontWeight: '700', letterSpacing: 2 },

  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40, gap: 14 },
  emptySuit: { fontSize: 32, color: colors.green, opacity: 0.08, letterSpacing: 10 },
  emptyText: { color: colors.textMuted, fontSize: 13, letterSpacing: 1, textAlign: 'center', lineHeight: 22 },
  emptyBtn: {
    marginTop: 8,
    backgroundColor: colors.greenDark,
    borderWidth: 1,
    borderColor: colors.green,
    borderRadius: 8,
    paddingHorizontal: 30,
    paddingVertical: 13,
  },
  emptyBtnText: { color: colors.white, fontSize: 16, fontWeight: '700', letterSpacing: 3 },

  scroll: { flex: 1 },
  scrollContent: { padding: 14, gap: 10 },

  card: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },
  cardMeta: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  cardNum: { fontSize: 9, letterSpacing: 2, color: colors.green, opacity: 0.5 },
  analyzedBadge: {
    backgroundColor: '#0d2a0d',
    borderWidth: 1,
    borderColor: '#1e4a1e',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  analyzedBadgeText: { fontSize: 8, letterSpacing: 1.5, color: colors.green },
  cardTime: { flex: 1, textAlign: 'right', fontSize: 9, color: colors.textMuted, letterSpacing: 1 },
  cardText: { fontSize: 12, color: colors.greenDim, lineHeight: 20, marginBottom: 12 },

  cardActions: { flexDirection: 'row', gap: 6 },
  actionBtn: { flex: 1, borderWidth: 1, borderRadius: 7, paddingVertical: 8, alignItems: 'center' },
  editBtn: { backgroundColor: '#142814', borderColor: colors.borderLight },
  editBtnText: { color: colors.greenDim, fontSize: 10, letterSpacing: 1, fontWeight: '600' },
  analyzeBtn: { backgroundColor: colors.greenDeep, borderColor: colors.green },
  analyzeBtnText: { color: '#bbf7d0', fontSize: 10, letterSpacing: 1, fontWeight: '600' },
  deleteBtn: { backgroundColor: colors.redBg, borderColor: colors.redBorder },
  deleteBtnText: { color: colors.red, fontSize: 10, letterSpacing: 1, fontWeight: '600' },
});
