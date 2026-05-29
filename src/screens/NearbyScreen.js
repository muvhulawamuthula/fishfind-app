import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import { getDamsNearby } from '../api/client';
import { colors, activityColor, activityBg } from '../theme';

const RADII = [25, 50, 100];

export default function NearbyScreen({ navigation }) {
  const [dams, setDams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [radius, setRadius] = useState(100);
  const [searched, setSearched] = useState(false);

  const findNearby = async () => {
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied. Please enable it in settings.');
        setLoading(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const data = await getDamsNearby(loc.coords.latitude, loc.coords.longitude, radius);
      setDams(data);
    } catch (e) {
      setError('Could not get location or reach the server.');
    } finally {
      setLoading(false);
    }
  };

  const renderDam = ({ item, index }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('NearbyDetail', { dam: item })}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.rankBadge}>
          <Text style={styles.rankText}>#{index + 1}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.damName}>{item.name}</Text>
          <Text style={styles.region}>{item.region}</Text>
        </View>
        <View style={[styles.activityBadge, { backgroundColor: activityBg(item.activityLevel) }]}>
          <Text style={[styles.activityText, { color: activityColor(item.activityLevel) }]}>
            {item.activityLevel}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.metaRow}>
        <Text style={styles.fee}>R{item.entranceFeeAdult}</Text>
        <Text style={styles.feeLabel}> entry</Text>
        {item.chaletsAvailable && <View style={styles.chip}><Text style={styles.chipText}>Chalets</Text></View>}
        {item.campingAvailable && <View style={styles.chip}><Text style={styles.chipText}>Camping</Text></View>}
      </View>

      {item.fishSpecies?.length > 0 && (
        <Text style={styles.species}>
          {item.fishSpecies.slice(0, 3).map((s) => s.commonName).join('  ·  ')}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.controlsCard}>
        <Text style={styles.controlsLabel}>SEARCH RADIUS</Text>
        <View style={styles.radiiRow}>
          {RADII.map((r) => (
            <TouchableOpacity
              key={r}
              style={[styles.radiusBtn, radius === r && styles.radiusBtnActive]}
              onPress={() => setRadius(r)}
            >
              <Text style={[styles.radiusText, radius === r && styles.radiusTextActive]}>
                {r} km
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.locateBtn} onPress={findNearby} activeOpacity={0.85}>
          <Text style={styles.locateBtnText}>Find Dams Near Me</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={styles.loadingText}>Getting your location…</Text>
        </View>
      )}

      {error && !loading && (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {!loading && !error && searched && dams.length === 0 && (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No dams found within {radius} km.</Text>
          <Text style={styles.emptyHint}>Try increasing the radius.</Text>
        </View>
      )}

      {!loading && dams.length > 0 && (
        <>
          <Text style={styles.resultCount}>
            {dams.length} dam{dams.length !== 1 ? 's' : ''} within {radius} km — sorted by distance
          </Text>
          <FlatList
            data={dams}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderDam}
            contentContainerStyle={styles.list}
          />
        </>
      )}

      {!loading && !searched && (
        <View style={styles.center}>
          <Text style={styles.hint}>Tap the button above to find fishing spots near you.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },

  controlsCard: {
    backgroundColor: colors.surface,
    margin: 16, borderRadius: 16, padding: 18,
    borderWidth: 1, borderColor: colors.border,
  },
  controlsLabel: {
    fontSize: 11, fontWeight: '700', color: colors.primary,
    letterSpacing: 1.2, marginBottom: 12,
  },
  radiiRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  radiusBtn: {
    flex: 1, paddingVertical: 9, borderRadius: 10,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center',
  },
  radiusBtnActive: { backgroundColor: colors.primaryFaint, borderColor: colors.primary },
  radiusText: { color: colors.textMuted, fontWeight: '600', fontSize: 14 },
  radiusTextActive: { color: colors.primary },
  locateBtn: {
    backgroundColor: colors.primary, borderRadius: 12,
    paddingVertical: 14, alignItems: 'center',
  },
  locateBtnText: { color: '#fff', fontSize: 15, fontWeight: '700', letterSpacing: 0.2 },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  loadingText: { color: colors.textSecondary, marginTop: 14, fontSize: 14 },
  errorText: { color: colors.danger, textAlign: 'center', lineHeight: 22 },
  emptyText: { color: colors.textSecondary, fontSize: 16 },
  emptyHint: { color: colors.textMuted, marginTop: 6, fontSize: 14 },
  hint: { color: colors.textMuted, textAlign: 'center', lineHeight: 24, fontSize: 14 },
  resultCount: {
    color: colors.textMuted, fontSize: 12, fontWeight: '500',
    marginHorizontal: 16, marginBottom: 6, letterSpacing: 0.2,
  },

  list: { paddingHorizontal: 16, paddingBottom: 24 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16, padding: 16, marginBottom: 10,
    borderWidth: 1, borderColor: colors.border,
    borderLeftWidth: 3, borderLeftColor: colors.primaryDark,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rankBadge: {
    backgroundColor: colors.primaryFaint,
    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4,
  },
  rankText: { color: colors.primary, fontWeight: '800', fontSize: 13 },
  cardInfo: { flex: 1 },
  damName: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  region: { color: colors.textMuted, fontSize: 13, marginTop: 1 },
  activityBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  activityText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.6 },

  divider: { height: 1, backgroundColor: colors.border, marginVertical: 12 },

  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  fee: { color: colors.textPrimary, fontSize: 14, fontWeight: '700' },
  feeLabel: { color: colors.textMuted, fontSize: 13 },
  chip: {
    backgroundColor: colors.surfaceRaised, borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 3,
    borderWidth: 1, borderColor: colors.border,
  },
  chipText: { color: colors.textSecondary, fontSize: 12, fontWeight: '500' },
  species: { color: colors.textMuted, fontSize: 13, marginTop: 10 },
});
