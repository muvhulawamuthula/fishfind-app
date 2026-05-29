import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet,
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { getDams, askAdvisor } from '../api/client';
import { colors } from '../theme';

export default function AdvisorScreen({ route }) {
  const preselectedDam = route?.params?.dam ?? null;

  const [dams, setDams] = useState(preselectedDam ? [preselectedDam] : []);
  const [allDams, setAllDams] = useState([]);
  const [selectedDam, setSelectedDam] = useState(preselectedDam);
  const [showPicker, setShowPicker] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    getDams()
      .then((data) => {
        setAllDams(data);
        if (!preselectedDam) setDams(data);
      })
      .catch(() => {});
  }, []);

  const send = async () => {
    const question = input.trim();
    if (!question || !selectedDam) return;

    const userMsg = { id: Date.now(), role: 'user', text: question };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setSending(true);

    try {
      const res = await askAdvisor(selectedDam.id, question);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'advisor', text: res.answer },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'error', text: 'Could not reach the AI advisor. Is the backend running?' },
      ]);
    } finally {
      setSending(false);
    }
  };

  const renderMessage = ({ item }) => {
    const isUser = item.role === 'user';
    const isError = item.role === 'error';
    return (
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAdvisor]}>
        {!isUser && (
          <Text style={styles.bubbleLabel}>{isError ? 'Error' : 'SA FishFind Advisor'}</Text>
        )}
        <Text style={[styles.bubbleText, isError && styles.bubbleError]}>{item.text}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      {/* Dam selector */}
      <TouchableOpacity
        style={styles.damSelector}
        onPress={() => setShowPicker((v) => !v)}
        activeOpacity={0.8}
      >
        <View style={styles.damSelectorLeft}>
          <Text style={styles.damSelectorLabel}>ASKING ABOUT</Text>
          <Text style={styles.damSelectorName}>
            {selectedDam ? selectedDam.name : 'Select a dam…'}
          </Text>
        </View>
        <Text style={styles.chevron}>{showPicker ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {showPicker && (
        <View style={styles.pickerDropdown}>
          <ScrollView style={{ maxHeight: 220 }} nestedScrollEnabled>
            {allDams.map((d) => (
              <TouchableOpacity
                key={d.id}
                style={[styles.pickerItem, selectedDam?.id === d.id && styles.pickerItemActive]}
                onPress={() => { setSelectedDam(d); setShowPicker(false); }}
              >
                <Text style={[styles.pickerItemText, selectedDam?.id === d.id && styles.pickerItemTextActive]}>
                  {d.name}
                </Text>
                {selectedDam?.id === d.id && <Text style={styles.pickerCheck}>✓</Text>}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Chat */}
      {messages.length === 0 && !sending ? (
        <View style={styles.emptyChat}>
          <View style={styles.emptyChatIcon}>
            <Text style={styles.emptyChatEmoji}>🎣</Text>
          </View>
          <Text style={styles.emptyChatTitle}>AI Fishing Advisor</Text>
          <Text style={styles.emptyChatSub}>
            {selectedDam
              ? `Ask anything about fishing at ${selectedDam.name} — bait, rigs, best spots, conditions.`
              : 'Select a dam above, then ask your fishing question.'}
          </Text>
          {selectedDam && (
            <View style={styles.suggestions}>
              {[
                `What bait works best for bass at ${selectedDam.name}?`,
                'What rigs should I bring?',
                'What are the best fishing times?',
              ].map((q) => (
                <TouchableOpacity key={q} style={styles.suggestion} onPress={() => setInput(q)}>
                  <Text style={styles.suggestionText}>{q}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderMessage}
          contentContainerStyle={styles.chatList}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        />
      )}

      {sending && (
        <View style={styles.typingRow}>
          <ActivityIndicator color={colors.primary} size="small" />
          <Text style={styles.typingText}>Advisor is thinking…</Text>
        </View>
      )}

      {/* Input */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder={selectedDam ? `Ask about ${selectedDam.name}…` : 'Select a dam first…'}
          placeholderTextColor={colors.textMuted}
          value={input}
          onChangeText={setInput}
          multiline
          editable={!!selectedDam}
          onSubmitEditing={send}
          returnKeyType="send"
          blurOnSubmit
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!input.trim() || !selectedDam || sending) && styles.sendBtnDisabled]}
          onPress={send}
          disabled={!input.trim() || !selectedDam || sending}
        >
          <Text style={styles.sendIcon}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },

  damSelector: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: colors.surface,
    margin: 16, marginBottom: 8,
    borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: colors.border,
  },
  damSelectorLeft: { flex: 1 },
  damSelectorLabel: {
    fontSize: 10, fontWeight: '700', color: colors.primary,
    letterSpacing: 1.2, marginBottom: 4,
  },
  damSelectorName: { color: colors.textPrimary, fontSize: 15, fontWeight: '700' },
  chevron: { color: colors.textMuted, fontSize: 13, marginLeft: 12 },

  pickerDropdown: {
    backgroundColor: colors.surface,
    marginHorizontal: 16, marginBottom: 6,
    borderRadius: 14, borderWidth: 1, borderColor: colors.borderBright,
    overflow: 'hidden',
  },
  pickerItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 15, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  pickerItemActive: { backgroundColor: colors.primaryFaint },
  pickerItemText: { color: colors.textSecondary, fontSize: 14 },
  pickerItemTextActive: { color: colors.primary, fontWeight: '700' },
  pickerCheck: { color: colors.primary, fontSize: 14, fontWeight: '700' },

  emptyChat: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 },
  emptyChatIcon: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: colors.primaryFaint,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1, borderColor: colors.borderBright,
  },
  emptyChatEmoji: { fontSize: 32 },
  emptyChatTitle: { fontSize: 20, fontWeight: '800', color: colors.textPrimary, marginBottom: 8 },
  emptyChatSub: { color: colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 24, fontSize: 14 },
  suggestions: { width: '100%', gap: 8 },
  suggestion: {
    backgroundColor: colors.surface, borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: colors.border,
  },
  suggestionText: { color: colors.primary, fontSize: 14 },

  chatList: { padding: 16, paddingBottom: 8 },
  bubble: { borderRadius: 16, padding: 14, marginBottom: 10, maxWidth: '85%' },
  bubbleUser: { backgroundColor: colors.primary, alignSelf: 'flex-end' },
  bubbleAdvisor: {
    backgroundColor: colors.surface, alignSelf: 'flex-start',
    borderWidth: 1, borderColor: colors.border,
  },
  bubbleLabel: {
    color: colors.primary, fontSize: 10, fontWeight: '700',
    letterSpacing: 0.8, marginBottom: 6,
  },
  bubbleText: { color: colors.textPrimary, fontSize: 14, lineHeight: 21 },
  bubbleError: { color: colors.danger },

  typingRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingBottom: 6, gap: 8,
  },
  typingText: { color: colors.textMuted, fontSize: 13 },

  inputRow: {
    flexDirection: 'row', alignItems: 'flex-end',
    padding: 12, paddingHorizontal: 16, gap: 10,
    borderTopWidth: 1, borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1, backgroundColor: colors.surfaceRaised,
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11,
    color: colors.textPrimary, fontSize: 15, maxHeight: 100,
    borderWidth: 1, borderColor: colors.inputBorder,
  },
  sendBtn: {
    backgroundColor: colors.primary, width: 44, height: 44,
    borderRadius: 22, alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: { opacity: 0.35 },
  sendIcon: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
