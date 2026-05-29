import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking,
} from 'react-native';
import { colors, activityColor, activityBg } from '../theme';

export default function DamDetailScreen({ route, navigation }) {
  const { dam } = route.params;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.name}>{dam.name}</Text>
          <View style={[styles.activityBadge, { backgroundColor: activityBg(dam.activityLevel) }]}>
            <Text style={[styles.activityText, { color: activityColor(dam.activityLevel) }]}>
              {dam.activityLevel}
            </Text>
          </View>
        </View>
        <Text style={styles.region}>{dam.region}</Text>
        <Text style={styles.address}>{dam.address}</Text>
        {dam.description ? <Text style={styles.description}>{dam.description}</Text> : null}
      </View>

      {/* Fishing info */}
      <Section title="FISHING INFO">
        <InfoRow label="Best times" value={dam.bestFishingTimes} />
        <InfoRow label="Adult entry" value={`R${dam.entranceFeeAdult}`} />
        {dam.entranceFeeChild != null && (
          <InfoRow label="Child entry" value={`R${dam.entranceFeeChild}`} />
        )}
        {dam.campingAvailable && (
          <InfoRow label="Camping" value={`R${dam.campingFeePerNight} / night`} />
        )}
        {dam.chaletsAvailable && (
          <InfoRow label="Chalets" value={`from R${dam.chaletFeePerNight} / night`} />
        )}
      </Section>

      {/* Safety */}
      <Section title="SAFETY">
        <SafetyRow label="Hippos" present={dam.hipposPresent} warningText="YES — keep your distance!" />
        <SafetyRow label="Crocodiles" present={dam.crocodilesPresent} warningText="YES — do not enter the water!" />
        <SafetyRow label="Bilharzia risk" present={dam.bilharziaRisk} warningText="YES — do not swim" />
        {dam.dangerAdvisory ? (
          <Text style={styles.advisory}>{dam.dangerAdvisory}</Text>
        ) : null}
      </Section>

      {/* Fish species */}
      {dam.fishSpecies?.length > 0 && (
        <Section title={`FISH SPECIES  ·  ${dam.fishSpecies.length}`}>
          {dam.fishSpecies.map((s) => (
            <View key={s.id} style={styles.speciesCard}>
              <View style={styles.speciesHeader}>
                <Text style={styles.speciesName}>{s.commonName}</Text>
                {s.scientificName ? (
                  <Text style={styles.speciesSci}>{s.scientificName}</Text>
                ) : null}
              </View>
              <SpeciesRow label="Best bait" value={s.bestBait} />
              <SpeciesRow label="Best rig" value={s.bestRig} />
              <SpeciesRow label="Technique" value={s.bestTechnique} />
              <SpeciesRow label="Avg size" value={s.averageSize} />
              {s.recordSize ? <SpeciesRow label="Record" value={s.recordSize} /> : null}
              <SpeciesRow label="Best season" value={s.bestSeason} />
            </View>
          ))}
        </Section>
      )}

      {/* Bait shops */}
      {dam.nearbyBaitShops?.length > 0 && (
        <Section title={`NEARBY BAIT SHOPS  ·  ${dam.nearbyBaitShops.length}`}>
          {dam.nearbyBaitShops.map((shop) => (
            <View key={shop.id} style={styles.shopCard}>
              <View style={styles.shopHeader}>
                <Text style={styles.shopName}>{shop.name}</Text>
                <View style={styles.distBadge}>
                  <Text style={styles.shopDist}>{shop.distanceFromDamKm} km</Text>
                </View>
              </View>
              {shop.address ? <Text style={styles.shopMeta}>{shop.address}</Text> : null}
              {shop.openingHours ? (
                <Text style={styles.shopMeta}>{shop.openingHours}</Text>
              ) : null}
              <View style={styles.shopActions}>
                {shop.phoneNumber ? (
                  <TouchableOpacity style={styles.shopBtn} onPress={() => Linking.openURL(`tel:${shop.phoneNumber}`)}>
                    <Text style={styles.shopBtnText}>Call</Text>
                  </TouchableOpacity>
                ) : null}
                {shop.googleMapsUrl ? (
                  <TouchableOpacity style={[styles.shopBtn, styles.shopBtnOutline]} onPress={() => Linking.openURL(shop.googleMapsUrl)}>
                    <Text style={styles.shopBtnOutlineText}>Directions</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          ))}
        </Section>
      )}

      {/* Resorts */}
      {dam.resorts?.length > 0 && (
        <Section title={`RESORTS & ACCOMMODATION  ·  ${dam.resorts.length}`}>
          {dam.resorts.map((resort) => (
            <ResortCard key={resort.id} resort={resort} />
          ))}
        </Section>
      )}

      {/* Ask Advisor */}
      <TouchableOpacity
        style={styles.advisorBtn}
        onPress={() => navigation.navigate('Advisor', { dam })}
        activeOpacity={0.8}
      >
        <Text style={styles.advisorBtnText}>Ask AI Fishing Advisor</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function InfoRow({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function SafetyRow({ label, present, warningText }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      {present ? (
        <View style={styles.dangerPill}>
          <Text style={styles.dangerPillText}>{warningText}</Text>
        </View>
      ) : (
        <View style={styles.safePill}>
          <Text style={styles.safePillText}>Clear</Text>
        </View>
      )}
    </View>
  );
}

function ResortCard({ resort }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <View style={styles.resortCard}>
      <TouchableOpacity onPress={() => setExpanded(v => !v)} activeOpacity={0.8}>
        <View style={styles.resortHeader}>
          <Text style={styles.resortName}>{resort.name}</Text>
          <Text style={styles.resortChevron}>{expanded ? '▲' : '▼'}</Text>
        </View>
        {resort.priceFrom ? (
          <Text style={styles.resortPrice}>{resort.priceFrom}</Text>
        ) : null}
      </TouchableOpacity>

      {expanded && (
        <View style={styles.resortBody}>
          {resort.description ? (
            <Text style={styles.resortDesc}>{resort.description}</Text>
          ) : null}
          {resort.accommodationTypes ? (
            <ResortRow label="Accommodation" value={resort.accommodationTypes} />
          ) : null}
          {resort.fishingAccess ? (
            <ResortRow label="Fishing access" value={resort.fishingAccess} />
          ) : null}
          {resort.facilities ? (
            <ResortRow label="Facilities" value={resort.facilities} />
          ) : null}
          <View style={styles.resortActions}>
            {resort.websiteUrl ? (
              <TouchableOpacity
                style={styles.resortBtn}
                onPress={() => Linking.openURL(resort.websiteUrl)}
              >
                <Text style={styles.resortBtnText}>Visit Website</Text>
              </TouchableOpacity>
            ) : null}
            {resort.phoneNumber ? (
              <TouchableOpacity
                style={[styles.resortBtn, styles.resortBtnOutline]}
                onPress={() => Linking.openURL(`tel:${resort.phoneNumber}`)}
              >
                <Text style={styles.resortBtnOutlineText}>Call</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      )}
    </View>
  );
}

function ResortRow({ label, value }) {
  if (!value) return null;
  return (
    <View style={styles.resortRow}>
      <Text style={styles.resortRowLabel}>{label}</Text>
      <Text style={styles.resortRowValue}>{value}</Text>
    </View>
  );
}

function SpeciesRow({ label, value }) {
  if (!value) return null;
  return (
    <View style={styles.speciesRow}>
      <Text style={styles.speciesLabel}>{label}</Text>
      <Text style={styles.speciesValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, paddingBottom: 40 },

  header: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  name: { fontSize: 22, fontWeight: '800', color: colors.textPrimary, flex: 1, marginRight: 10 },
  activityBadge: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  activityText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.6 },
  region: { color: colors.textSecondary, fontSize: 14, marginTop: 6, fontWeight: '500' },
  address: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  description: { color: colors.textSecondary, fontSize: 14, marginTop: 12, lineHeight: 22 },

  section: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 11, fontWeight: '700', color: colors.primary,
    letterSpacing: 1.2, marginBottom: 14,
  },

  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 9,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  infoLabel: { color: colors.textMuted, fontSize: 14 },
  infoValue: { color: colors.textPrimary, fontSize: 14, fontWeight: '600', flexShrink: 1, textAlign: 'right', maxWidth: '60%' },

  dangerPill: {
    backgroundColor: colors.dangerFaint, borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 4,
    borderWidth: 1, borderColor: colors.danger, flexShrink: 1,
  },
  dangerPillText: { color: colors.danger, fontSize: 12, fontWeight: '600' },
  safePill: {
    backgroundColor: colors.successFaint, borderRadius: 6,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  safePillText: { color: colors.success, fontSize: 12, fontWeight: '600' },
  advisory: { color: colors.textMuted, fontSize: 13, marginTop: 10, lineHeight: 20 },

  speciesCard: {
    backgroundColor: colors.surfaceRaised,
    borderRadius: 12, padding: 14, marginBottom: 8,
    borderWidth: 1, borderColor: colors.border,
  },
  speciesHeader: { marginBottom: 10 },
  speciesName: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  speciesSci: { fontSize: 12, color: colors.textMuted, fontStyle: 'italic', marginTop: 2 },
  speciesRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  speciesLabel: { color: colors.textMuted, fontSize: 13 },
  speciesValue: { color: colors.textSecondary, fontSize: 13, flexShrink: 1, textAlign: 'right', maxWidth: '62%' },

  shopCard: {
    backgroundColor: colors.surfaceRaised,
    borderRadius: 12, padding: 14, marginBottom: 8,
    borderWidth: 1, borderColor: colors.border,
  },
  shopHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  shopName: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, flex: 1, marginRight: 8 },
  distBadge: {
    backgroundColor: colors.primaryFaint, borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  shopDist: { color: colors.primary, fontSize: 12, fontWeight: '600' },
  shopMeta: { color: colors.textMuted, fontSize: 13, marginBottom: 2 },
  shopActions: { flexDirection: 'row', gap: 8, marginTop: 10 },
  shopBtn: {
    backgroundColor: colors.primary, borderRadius: 8,
    paddingHorizontal: 16, paddingVertical: 7,
  },
  shopBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  shopBtnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1, borderColor: colors.primary,
  },
  shopBtnOutlineText: { color: colors.primary, fontSize: 13, fontWeight: '700' },

  advisorBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14, padding: 18,
    alignItems: 'center', marginTop: 6,
  },
  advisorBtnText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },

  resortCard: {
    backgroundColor: colors.surfaceRaised,
    borderRadius: 12, marginBottom: 8,
    borderWidth: 1, borderColor: colors.border,
    overflow: 'hidden',
  },
  resortHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 14,
  },
  resortName: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, flex: 1, marginRight: 8 },
  resortChevron: { color: colors.primary, fontSize: 12 },
  resortPrice: {
    color: colors.primary, fontSize: 12, fontWeight: '600',
    paddingHorizontal: 14, paddingBottom: 10,
  },
  resortBody: {
    borderTopWidth: 1, borderTopColor: colors.border, padding: 14, paddingTop: 12,
  },
  resortDesc: { color: colors.textSecondary, fontSize: 13, lineHeight: 20, marginBottom: 12 },
  resortRow: { marginBottom: 8 },
  resortRowLabel: {
    fontSize: 10, fontWeight: '700', color: colors.primary,
    letterSpacing: 0.8, marginBottom: 2,
  },
  resortRowValue: { color: colors.textSecondary, fontSize: 13, lineHeight: 18 },
  resortActions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  resortBtn: {
    backgroundColor: colors.primary, borderRadius: 8,
    paddingHorizontal: 18, paddingVertical: 8,
  },
  resortBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  resortBtnOutline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.primary },
  resortBtnOutlineText: { color: colors.primary, fontSize: 13, fontWeight: '700' },
});
