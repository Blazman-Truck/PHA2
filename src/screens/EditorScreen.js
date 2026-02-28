import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, SafeAreaView,
} from 'react-native';
import { colors } from '../theme';

const PLAYERS   = ['Hero', 'Villain'];
const POSITIONS = ['Button','Cutoff','Highjack','Lowjack','UTG+3','UTG+2','UTG+1','UTG','BB','SB'];
const ACTIONS   = ['Check','Bet','Call','Raise','Fold','All-in'];
const STREETS   = ['Flop','Turn','River'];
const FACE_CARDS = ['A','K','Q','J','T'];
const NUMBERS   = ['1','2','3','4','5','6','7','8','9','0'];
const SUITS = [
  { label: '♣', value: 'c', color: '#e2e8f0' },
  { label: '♦', value: 'd', color: '#f87171' },
  { label: '♥', value: 'h', color: '#f87171' },
  { label: '♠', value: 's', color: '#e2e8f0' },
];

export default function EditorScreen({ initialHand, isEdit, onBack, onSaveAndBack }) {
  const [hand, setHand]               = useState(initialHand || '');
  const [activePlayer, setActivePlayer] = useState(null);
  const [activePos, setActivePos]     = useState(null);

  const append = (text) => setHand(prev => prev + text);
  const handlePlayer   = (p)   => { setActivePlayer(p); append(p + ' '); };
  const handlePosition = (pos) => { setActivePos(pos);  append(pos + ' '); };
  const handleBack     = ()    => setHand(prev => prev.slice(0, -1));
  const handleClear    = ()    => { setHand(''); setActivePlayer(null); setActivePos(null); };

  const canSubmit = hand.trim().length > 0;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgDeep} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.75}>
          <Text style={styles.backBtnText}>← BACK</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEdit ? 'EDIT HAND' : 'NEW HAND'}</Text>
      </View>

      {/* Pinned Hand Textarea */}
      <View style={styles.pinnedArea}>
        <Text style={styles.sectionLabel}>HAND</Text>
        <TextInput
          style={styles.handInput}
          value={hand}
          onChangeText={setHand}
          placeholder="Tap below to build your hand..."
          placeholderTextColor={colors.textMuted}
          multiline
          autoCorrect={false}
          autoCapitalize="none"
          spellCheck={false}
        />
      </View>

      {/* Scrollable sections */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Player */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>PLAYER</Text>
          <View style={styles.chipGroup}>
            {PLAYERS.map(p => (
              <TouchableOpacity
                key={p}
                style={[styles.chip, activePlayer === p && styles.chipActive]}
                onPress={() => handlePlayer(p)}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, activePlayer === p && styles.chipTextActive]}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Position */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>POSITION</Text>
          <View style={styles.chipGroup}>
            {POSITIONS.map(pos => (
              <TouchableOpacity
                key={pos}
                style={[styles.chip, activePos === pos && styles.chipActive]}
                onPress={() => handlePosition(pos)}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, activePos === pos && styles.chipTextActive]}>{pos}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Action */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ACTION</Text>
          <View style={styles.actionGrid}>
            {ACTIONS.map(a => (
              <TouchableOpacity
                key={a}
                style={styles.actionBtn}
                onPress={() => append(a + ' ')}
                activeOpacity={0.7}
              >
                <Text style={styles.actionBtnText}>{a}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Street + BB/$ */}
        <View style={styles.streetBbRow}>
          <View style={[styles.section, { flex: 1 }]}>
            <Text style={styles.sectionLabel}>STREET</Text>
            <View style={styles.chipGroup}>
              {STREETS.map(s => (
                <TouchableOpacity
                  key={s}
                  style={styles.chip}
                  onPress={() => append(s + ' ')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.chipText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={[styles.section, { flex: 1 }]}>
            <Text style={styles.sectionLabel}>BB / $</Text>
            <View style={styles.chipGroup}>
              <TouchableOpacity style={styles.bbChip} onPress={() => append('BB ')} activeOpacity={0.7}>
                <Text style={styles.bbChipText}>BB</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.bbChip} onPress={() => append('$ ')} activeOpacity={0.7}>
                <Text style={styles.bbChipText}>$</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>CARDS</Text>
          <View style={styles.cardKeyboard}>
            {/* Face cards */}
            <View style={styles.cardRow}>
              {FACE_CARDS.map(c => (
                <TouchableOpacity key={c} style={styles.cardKey} onPress={() => append(c)} activeOpacity={0.7}>
                  <Text style={styles.cardKeyText}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {/* Suits */}
            <View style={styles.cardRow}>
              {SUITS.map(s => (
                <TouchableOpacity key={s.value} style={styles.suitKey} onPress={() => append(s.value)} activeOpacity={0.7}>
                  <Text style={[styles.suitKeyText, { color: s.color }]}>{s.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {/* Numbers */}
            <View style={styles.cardRow}>
              {NUMBERS.map(n => (
                <TouchableOpacity key={n} style={styles.numKey} onPress={() => append(n)} activeOpacity={0.7}>
                  <Text style={styles.numKeyText}>{n}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {/* Utility */}
            <View style={styles.utilRow}>
              <TouchableOpacity style={[styles.utilKey, { flex: 2 }]} onPress={() => append(' ')} activeOpacity={0.7}>
                <Text style={styles.utilKeyText}>SPACE</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.utilKey, { flex: 1 }]} onPress={handleBack} activeOpacity={0.7}>
                <Text style={styles.utilKeyText}>⌫ BACK</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.utilKey, styles.utilKeyDanger, { flex: 1 }]} onPress={handleClear} activeOpacity={0.7}>
                <Text style={styles.utilKeyDangerText}>CLEAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={() => canSubmit && onSaveAndBack(hand.trim(), false)}
          activeOpacity={0.75}
        >
          <Text style={styles.saveBtnText}>SAVE</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.analyzeBtn, !canSubmit && styles.disabledBtn]}
          onPress={() => canSubmit && onSaveAndBack(hand.trim(), true)}
          activeOpacity={0.75}
          disabled={!canSubmit}
        >
          <Text style={styles.analyzeBtnText}>SAVE & ANALYZE</Text>
        </TouchableOpacity>
      </View>
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
    gap: 12,
  },
  backBtn: {
    borderWidth: 1, borderColor: colors.borderLight, borderRadius: 6,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  backBtnText: { color: colors.green, fontSize: 10, letterSpacing: 1, fontWeight: '600' },
  headerTitle: { flex: 1, color: colors.green, fontSize: 20, fontWeight: '700', letterSpacing: 3 },

  pinnedArea: {
    backgroundColor: colors.bgPinned,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 12,
  },

  sectionLabel: {
    fontSize: 9, letterSpacing: 2, color: colors.green,
    opacity: 0.75, marginBottom: 8, fontWeight: '600',
  },

  handInput: {
    backgroundColor: colors.bgInput,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: 11,
    paddingVertical: 9,
    color: colors.greenDim,
    fontSize: 13,
    lineHeight: 20,
    minHeight: 68,
    textAlignVertical: 'top',
  },

  scroll: { flex: 1 },
  scrollContent: { padding: 14, gap: 10, paddingBottom: 250 }, // Increased paddingBottom

  section: {
    backgroundColor: colors.bgSection,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 12,
    marginBottom: 0,
  },

  chipGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    backgroundColor: '#142814', borderWidth: 1, borderColor: colors.borderLight,
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5,
  },
  chipActive: { backgroundColor: colors.greenDark, borderColor: colors.green },
  chipText: { color: colors.greenMid, fontSize: 11, fontWeight: '500' },
  chipTextActive: { color: colors.green },

  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  actionBtn: {
    width: '31%', backgroundColor: '#142814', borderWidth: 1, borderColor: colors.borderLight,
    borderRadius: 8, paddingVertical: 9, alignItems: 'center',
  },
  actionBtnText: { color: colors.greenMid, fontSize: 11, fontWeight: '500' },

  streetBbRow: { flexDirection: 'row', gap: 10 },

  bbChip: {
    backgroundColor: colors.purpleBg, borderWidth: 1, borderColor: colors.purpleBorder,
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5,
  },
  bbChipText: { color: colors.purple, fontSize: 11, fontWeight: '500' },

  cardKeyboard: { gap: 7 },
  cardRow: { flexDirection: 'row', gap: 5 },

  cardKey: {
    flex: 1, backgroundColor: '#162e16', borderWidth: 1, borderColor: colors.borderLight,
    borderRadius: 7, paddingVertical: 10, alignItems: 'center',
  },
  cardKeyText: { color: colors.greenDim, fontSize: 20, fontWeight: '700' },

  suitKey: {
    flex: 1, backgroundColor: '#162e16', borderWidth: 1, borderColor: colors.borderLight,
    borderRadius: 7, paddingVertical: 9, alignItems: 'center',
  },
  suitKeyText: { fontSize: 21 },

  numKey: {
    flex: 1, backgroundColor: '#142814', borderWidth: 1, borderColor: colors.border,
    borderRadius: 7, paddingVertical: 8, alignItems: 'center',
  },
  numKeyText: { color: colors.greenDim, fontSize: 14, fontWeight: '500' },

  utilRow: { flexDirection: 'row', gap: 6 },
  utilKey: {
    backgroundColor: '#0d2a1a', borderWidth: 1, borderColor: '#1a4a2a',
    borderRadius: 7, paddingVertical: 8, alignItems: 'center', justifyContent: 'center',
  },
  utilKeyText: { color: '#6ee7b7', fontSize: 10, letterSpacing: 1, fontWeight: '600' },
  utilKeyDanger: { backgroundColor: colors.redBg, borderColor: colors.redBorder },
  utilKeyDangerText: { color: colors.red, fontSize: 10, letterSpacing: 1, fontWeight: '600' },

  bottomBar: {
    backgroundColor: colors.bgBar,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 12,
    flexDirection: 'row',
    gap: 8,
  },
  saveBtn: {
    flex: 1, backgroundColor: '#142814', borderWidth: 1, borderColor: colors.borderLight,
    borderRadius: 8, paddingVertical: 13, alignItems: 'center',
  },
  saveBtnText: { color: colors.greenDim, fontSize: 11, letterSpacing: 1, fontWeight: '600' },
  analyzeBtn: {
    flex: 2, backgroundColor: colors.greenDark, borderWidth: 1, borderColor: colors.green,
    borderRadius: 8, paddingVertical: 13, alignItems: 'center',
  },
  analyzeBtnText: { color: colors.white, fontSize: 14, letterSpacing: 2, fontWeight: '700' },
  disabledBtn: { opacity: 0.35 },
});
