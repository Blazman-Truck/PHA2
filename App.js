import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen     from './src/screens/HomeScreen';
import EditorScreen   from './src/screens/EditorScreen';
import AnalysisScreen from './src/screens/AnalysisScreen';
import { loadHands, saveHands } from './src/storage';
import { colors } from './src/theme';

export default function App() {
  const [screen, setScreen]           = useState('home');   // 'home' | 'editor' | 'analysis'
  const [savedHands, setSavedHands]   = useState([]);
  const [editingHand, setEditingHand] = useState(null);
  const [analysisHandId, setAnalysisHandId] = useState(null);

  // Load hands from storage on startup
  useEffect(() => {
    loadHands().then(setSavedHands);
  }, []);

  // Persist hands whenever they change
  useEffect(() => {
    saveHands(savedHands);
  }, [savedHands]);

  const timestamp = () => {
    const d = new Date();
    return {
      date: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      time: d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const handleNew = () => {
    setEditingHand(null);
    setScreen('editor');
  };

  const handleEdit = (h) => {
    setEditingHand(h);
    setScreen('editor');
  };

  const handleAnalyzeFromHome = (h) => {
    setAnalysisHandId(h.id);
    setScreen('analysis');
  };

  const handleDelete = (id) => {
    setSavedHands(prev => prev.filter(h => h.id !== id));
  };

  const handleSaveAndBack = (text, goAnalyze = false) => {
    let savedId;

    if (editingHand) {
      const textChanged = editingHand.text !== text;
      setSavedHands(prev =>
        prev.map(h =>
          h.id === editingHand.id
            ? { ...h, text, ...timestamp(), ...(textChanged ? { analysis: null } : {}) }
            : h
        )
      );
      savedId = editingHand.id;
    } else {
      savedId = Date.now();
      setSavedHands(prev => [{ id: savedId, text, ...timestamp() }, ...prev]);
    }

    if (goAnalyze) {
      setAnalysisHandId(savedId);
      setScreen('analysis');
    } else {
      setScreen('home');
    }
  };

  const handleAnalysisSaved = (handId, analysisText) => {
    setSavedHands(prev =>
      prev.map(h => h.id === handId ? { ...h, analysis: analysisText } : h)
    );
  };

  const currentAnalysisHand = savedHands.find(h => h.id === analysisHandId);

  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        {screen === 'home' && (
          <HomeScreen
            savedHands={savedHands}
            onNew={handleNew}
            onEdit={handleEdit}
            onAnalyze={handleAnalyzeFromHome}
            onDelete={handleDelete}
          />
        )}

        {screen === 'editor' && (
          <EditorScreen
            key={editingHand ? editingHand.id : 'new'}
            initialHand={editingHand?.text || ''}
            isEdit={!!editingHand}
            onBack={() => setScreen('home')}
            onSaveAndBack={handleSaveAndBack}
          />
        )}

        {screen === 'analysis' && currentAnalysisHand && (
          <AnalysisScreen
            key={analysisHandId}
            hand={currentAnalysisHand.text}
            cachedAnalysis={currentAnalysisHand.analysis || null}
            onAnalysisSaved={(text) => handleAnalysisSaved(analysisHandId, text)}
            onBack={() => setScreen('home')}
          />
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
});
