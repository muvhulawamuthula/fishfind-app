import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, TextInput, RefreshControl,
} from 'react-native';
import { getDams, getDamsWithChalets, getDamsWithCamping } from '../api/client';
import { colors, activityColor, activityBg } from '../theme';

const FILTERS = ['All', 'Chalets', 'Camping'];

export default function DamListScreen({ navigation }) {
  const [dams, setDams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const load = useCallback(async (activeFilter = filter) => {
    try {
      setError(null);
      let data;
      if (activeFilter === 'Chalets') data = await getDamsWithChalets();
      else if (activeFilter === 'Camping') data = await getDamsWithCamping();
      else data = await getDams();
      setDams(data);
    } catch (e) {
      setError('Could not reach the server. Is the backend running?');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filter]);

  useEffect(() => { load(); }, []);

  const handleFilter = (f) => {
    setFilter(f);
    setLoading(true);
    load(f);
  };

  const filtered = dams.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.region.toLowerCase().includes(search.toLowerCase())
  );

  const renderDam = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('DamDetail', { dam: item })}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.damName}>{item.name}</Text>
        <View style={[styles.activityBadge, { backgroundColor: activityBg(item.activityLevel) }]}>
          <Text style={[styles.activityText, { color: activityColor(item.activityLevel) }]}>
            {item.activityLevel}
          </Text>
        </View>
      </View>

      <Text style={styles.region}>{item.region}</Text>

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

      {(item.hipposPresent || item.crocodilesPresent || item.bilharziaRisk) && (
        <View style={styles.safetyRow}>
          {item.hipposPresent    && <View style={styles.warnChip}><Text style={styles.warnText}>Hippos</Text></View>}
          {item.crocodilesPresent && <View style={styles.warnChip}><Text style={styles.warnText}>Crocs</Text></View>}
          {item.bilharziaRisk    && <View style={styles.warnChip}><Text style={styles.warnText}>Bilharzia</Text></View>}
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchWrapper}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          style={styles.search}
          placeholder="Search dams or regions…"
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            onPress={() => handleFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} color={colors.primary} size="large" />
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => { setLoading(true); load(); }}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderDam}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { setRefreshing(true); load(); }}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <Text style={styles.empty}>No dams found.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },

  searchWrapper: {
    flexDirection: 'row', alignItems: 'center',
    margin: 16, marginBottom: 10,
    backgroundColor: colors.surface,
    borderRadius: 12, borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: 14,
  },
  searchIcon: { color: colors.textMuted, fontSize: 18, marginRight: 8 },
  search: {
    flex: 1, paddingVertical: 11,
    color: colors.textPrimary, fontSize: 15,
  },

  filterRow: {
    flexDirection: 'row',
    marginHorizontal: 16, marginBottom: 12,
    backgroundColor: colors.surface,
    borderRadius: 10, borderWidth: 1, borderColor: colors.border,
    padding: 3,
  },
  filterBtn: {
    flex: 1, paddingVertical: 7, borderRadius: 8, alignItems: 'center',
  },
  filterBtnActive: { backgroundColor: colors.primaryFaint },
  filterText: { color: colors.textMuted, fontSize: 13, fontWeight: '500' },
  filterTextActive: { color: colors.primary, fontWeight: '700' },

  list: { paddingHorizontal: 16, paddingBottom: 24 },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  damName: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, flex: 1, marginRight: 10 },
  activityBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  activityText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.6 },

  region: { color: colors.textMuted, fontSize: 13, marginTop: 3 },

  divider: { height: 1, backgroundColor: colors.border, marginVertical: 12 },

  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  fee: { color: colors.textPrimary, fontSize: 14, fontWeight: '700' },
  feeLabel: { color: colors.textMuted, fontSize: 13 },
  chip: {
    backgroundColor: colors.surfaceRaised,
    borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3,
    borderWidth: 1, borderColor: colors.border,
  },
  chipText: { color: colors.textSecondary, fontSize: 12, fontWeight: '500' },

  species: { color: colors.textMuted, fontSize: 13, marginTop: 10, letterSpacing: 0.2 },

  safetyRow: { flexDirection: 'row', gap: 6, marginTop: 10, flexWrap: 'wrap' },
  warnChip: {
    backgroundColor: colors.dangerFaint, borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 3,
    borderWidth: 1, borderColor: colors.danger,
  },
  warnText: { color: colors.danger, fontSize: 11, fontWeight: '600' },

  loader: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  errorText: { color: colors.textSecondary, textAlign: 'center', marginBottom: 20, lineHeight: 22 },
  retryBtn: {
    backgroundColor: colors.primaryFaint, paddingHorizontal: 28, paddingVertical: 11,
    borderRadius: 10, borderWidth: 1, borderColor: colors.primary,
  },
  retryText: { color: colors.primary, fontWeight: '700', fontSize: 14 },
  empty: { color: colors.textMuted, textAlign: 'center', marginTop: 48, fontSize: 15 },
});
