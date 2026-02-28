import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, SafeAreaView, ActivityIndicator, Clipboard, Linking, Alert, // Added Alert
} from 'react-native';
import { colors } from '../theme';

// ── Point this at your deployed Render URL after deployment ──
// e.g. 'https://poker-proxy.onrender.com'
const PROXY_URL = 'https://poker-proxy-i0rl.onrender.com';

export default function AnalysisScreen({ hand, cachedAnalysis, onAnalysisSaved, onBack }) {
  const [analysis, setAnalysis]   = useState(cachedAnalysis || null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError]         = useState(null);
  const hasRun = useRef(false);

  const runAnalysis = async () => {
    setAnalyzing(true);
    setAnalysis(null);
    setError(null);
    try {
      const res = await fetch(`${PROXY_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hand }),
      });

      const data = await res.json();

      if (data.analysis) {
        setAnalysis(data.analysis);
        onAnalysisSaved(data.analysis);
      } else {
        setError(data.error || 'No analysis returned. Tap REDO to try again.');
      }
    } catch {
      setError('Connection failed. Check your network and tap REDO.');
    } finally {
      setAnalyzing(false);
    }
  };

  // Function to handle copying to clipboard
  const handleShareClipboard = () => {
    const shareText = `Poker Hand Analysis:\n\nHand: ${hand}\n\nAnalysis: ${analysis || 'No analysis available yet.'}\n\n`;
    Clipboard.setString(shareText);
    // alert('Hand and analysis copied to clipboard!'); // Removed alert
  };

  // Function to handle sharing via email
  const handleShareEmail = () => {
    const subject = encodeURIComponent("Check out this hand");
    const body = encodeURIComponent(`Poker Hand Analysis:\n\nHand: ${hand}\n\nAnalysis: ${analysis || 'No analysis available yet.'}\n\n`);
    const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;

    Linking.canOpenURL(mailtoUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(mailtoUrl);
        } else {
          // alert("Cannot open email client. Please ensure you have an email app configured."); // Removed alert
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };

  // Function to present share options
  const handleShareOptions = () => {
    Alert.alert(
      "Share Analysis",
      "How would you like to share this hand and analysis?",
      [
        {
          text: "Copy to Clipboard",
          onPress: handleShareClipboard,
        },
        {
          text: "Email",
          onPress: handleShareEmail,
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  // Auto-run only if no cached analysis
  if (!hasRun.current) {
    hasRun.current = true;
    if (!cachedAnalysis) runAnalysis();
  }

  const isCached = !!cachedAnalysis && analysis === cachedAnalysis;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgDeep} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.75}>
          <Text style={styles.backBtnText}>← BACK</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ANALYSIS</Text>
        {!analyzing && (
          <>
            <TouchableOpacity style={styles.backBtn} onPress={runAnalysis} activeOpacity={0.75}>
              <Text style={styles.backBtnText}>↺ REDO</Text>
            </TouchableOpacity>
            {analysis && ( // Only show share button if analysis is available
              <TouchableOpacity style={styles.backBtn} onPress={handleShareOptions} activeOpacity={0.75}>
                <Text style={styles.backBtnText}>SHARE</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hand display */}
        <View style={styles.handBox}>
          <Text style={styles.handLabel}>HAND</Text>
          <Text style={styles.handText}>{hand}</Text>
        </View>

        {/* Cached badge */}
        {isCached && (
          <View style={styles.cachedRow}>
            <Text style={styles.cachedText}>● SAVED ANALYSIS</Text>
          </View>
        )}

        {/* Result */}
        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>
            {analyzing ? 'ANALYZING' : analysis ? 'COACH ANALYSIS' : 'RESULT'}
          </Text>

          {analyzing && (
            <View style={styles.loadingRow}>
              <ActivityIndicator color={colors.green} size="small" />
              <Text style={styles.loadingText}>PROCESSING...</Text>
            </View>
          )}

          {analysis && !analyzing && (
            <Text style={styles.analysisText}>{analysis}</Text>
          )}

          {error && !analyzing && (
            <Text style={styles.errorText}>{error}</Text>
          )}
        </View>
      </ScrollView>
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
  backBtn: {
    borderWidth: 1, borderColor: colors.borderLight, borderRadius: 6,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  backBtnText: { color: colors.green, fontSize: 10, letterSpacing: 1, fontWeight: '600' },
  headerTitle: { flex: 1, color: colors.green, fontSize: 20, fontWeight: '700', letterSpacing: 3 },

  scroll: { flex: 1 },
  scrollContent: { padding: 14, gap: 14, paddingBottom: 150 }, // Increased paddingBottom

  handBox: {
    backgroundColor: colors.bgInput,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 13,
  },
  handLabel: { fontSize: 9, letterSpacing: 2, color: colors.green, opacity: 0.55, marginBottom: 6, fontWeight: '600' },
  handText: { fontSize: 12, color: colors.green, lineHeight: 20 },

  cachedRow: { flexDirection: 'row', alignItems: 'center', paddingLeft: 2 },
  cachedText: { fontSize: 9, letterSpacing: 2, color: colors.green, opacity: 0.5 },

  resultBox: {
    backgroundColor: '#0d1f0d',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 14,
    minHeight: 120,
  },
  resultLabel: { fontSize: 9, letterSpacing: 2, color: colors.green, opacity: 0.55, marginBottom: 10, fontWeight: '600' },

  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 20 },
  loadingText: { color: colors.green, fontSize: 12, letterSpacing: 2 },

  analysisText: { fontSize: 13, color: colors.greenMid, lineHeight: 24 },
  errorText: { fontSize: 12, color: colors.red, lineHeight: 20 },
});