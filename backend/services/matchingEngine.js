/**
 * LifeLink - Smart Blood Matching & Emergency Response Engine
 * Provides intelligent decision support for emergency blood allocation.
 */

// Blood Group Compatibility Matrix (Recipient -> Compatible Donors/Stock)
const COMPATIBILITY_MAP = {
  'O-': ['O-'],
  'O+': ['O+', 'O-'],
  'A-': ['A-', 'O-'],
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'AB-': ['AB-', 'A-', 'B-', 'O-'],
  'AB+': ['AB+', 'AB-', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-']
};

/**
 * Calculates Haversine distance in kilometers between two GPS coordinates
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in KM
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
}

/**
 * Check if donor/stock group is compatible with recipient blood group
 */
function isCompatible(recipientGroup, donorGroup) {
  const allowed = COMPATIBILITY_MAP[recipientGroup] || [recipientGroup];
  return allowed.includes(donorGroup);
}

/**
 * Smart Blood Matching & Emergency Response Engine algorithm
 */
function rankOptions({ patientLat, patientLng, bloodGroup, unitsRequired, bloodBanks = [], donors = [] }) {
  const compatibleGroups = COMPATIBILITY_MAP[bloodGroup] || [bloodGroup];

  // 1. Rank Blood Banks
  const rankedBloodBanks = bloodBanks.map(bank => {
    const distanceKm = calculateDistance(patientLat, patientLng, bank.location.lat, bank.location.lng);
    
    // Find matching inventory
    const matchingStock = bank.inventory?.filter(inv => compatibleGroups.includes(inv.bloodGroup)) || [];
    const totalMatchingUnits = matchingStock.reduce((acc, curr) => acc + curr.unitsAvailable, 0);

    const isExactMatch = bank.inventory?.some(inv => inv.bloodGroup === bloodGroup && inv.unitsAvailable >= unitsRequired);

    // Scoring (0 - 100)
    // Proximity score: max 35 pts (0km = 35pts, 35km+ = 0pts)
    const proximityScore = Math.max(0, 35 - distanceKm);
    
    // Compatibility & Stock score: max 50 pts
    const compatibilityScore = isExactMatch ? 30 : 20;
    const stockScore = Math.min(20, (totalMatchingUnits / Math.max(1, unitsRequired)) * 20);

    // Reliability & 24x7 rating score: max 15 pts
    const reliabilityScore = (bank.isOpen24x7 ? 10 : 5) + (bank.rating ? bank.rating : 4.5);

    const matchScore = Math.round(proximityScore + compatibilityScore + stockScore + reliabilityScore);
    const estimatedTimeMin = Math.round(distanceKm * 2.5 + 5); // 2.5 mins per KM + 5 min prep time

    return {
      ...bank,
      distanceKm,
      totalMatchingUnits,
      isExactMatch,
      matchScore: Math.min(99, Math.max(60, matchScore)),
      estimatedTimeMin,
      recommendationReason: isExactMatch 
        ? `Exact blood group (${bloodGroup}) available in full requirement (${totalMatchingUnits} units).`
        : `Compatible blood group (${compatibleGroups.join(', ')}) available.`
    };
  }).sort((a, b) => b.matchScore - a.matchScore);

  // 2. Rank Donors
  const rankedDonors = donors.map(donor => {
    const distanceKm = calculateDistance(patientLat, patientLng, donor.location.lat, donor.location.lng);
    const isExactGroup = donor.bloodGroup === bloodGroup;
    const isComp = isCompatible(bloodGroup, donor.bloodGroup);

    const proximityScore = Math.max(0, 40 - distanceKm);
    const compScore = isExactGroup ? 40 : (isComp ? 30 : 0);
    const reliabilityScore = (donor.rating || 4.8) * 4;

    const matchScore = Math.round(proximityScore + compScore + reliabilityScore);
    const estimatedArrivalMin = Math.round(distanceKm * 3 + 12);

    return {
      ...donor,
      distanceKm,
      isExactGroup,
      isCompatible: isComp,
      matchScore: Math.min(98, Math.max(55, matchScore)),
      estimatedArrivalMin
    };
  }).filter(d => d.isCompatible).sort((a, b) => b.matchScore - a.matchScore);

  // 3. System Emergency Insights
  const topBank = rankedBloodBanks[0];
  const hasImmediateStock = topBank && topBank.totalMatchingUnits >= unitsRequired;

  const insights = {
    urgencyPriority: unitsRequired >= 3 ? 'HIGH CRITICAL' : 'URGENT EMERGENCY',
    recommendedAction: hasImmediateStock 
      ? `Reserve immediately from ${topBank.name} (${topBank.distanceKm} km away, ~${topBank.estimatedTimeMin} mins travel).`
      : `Initiate dual request to nearby compatible donors (${rankedDonors.length} active donors notified).`,
    estimatedWaitMinutes: topBank ? topBank.estimatedTimeMin : 15,
    compatibleBloodGroups: compatibleGroups
  };

  return {
    rankedBloodBanks,
    rankedDonors,
    insights
  };
}

/**
 * Predict blood shortage risk for a district
 */
function predictDistrictShortage(districtInventory = []) {
  const stats = {};
  ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].forEach(bg => {
    const total = districtInventory
      .filter(i => i.bloodGroup === bg)
      .reduce((sum, item) => sum + item.unitsAvailable, 0);
    stats[bg] = {
      units: total,
      riskLevel: total < 5 ? 'HIGH RISK (CRITICAL SHORTAGE)' : (total < 15 ? 'MODERATE RISK' : 'STABLE')
    };
  });
  return stats;
}

module.exports = {
  calculateDistance,
  isCompatible,
  rankOptions,
  predictDistrictShortage,
  COMPATIBILITY_MAP
};
