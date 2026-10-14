/**
 * Centralized Mantra Configuration & Voice Recognition Matching Rules
 */

export const MANTRAS = [
  {
    id: 'rama',
    name: 'Rama',
    sanskrit: 'राम',
    transliteration: 'Śrī Rāma',
    meaning: 'The Embodiment of Righteousness and Divine Bliss',
    defaultLang: 'hi-IN',
    category: 'Single Name / Taraka Mantra',
    beadsPerMala: 108,
    // Rama matches single words: Rama, Ram, राम
    type: 'word',
    keywords: ['rama', 'ram', 'raama', 'raam', 'राम', 'रामा', 'श्रीराम', 'shri ram', 'shree ram'],
    matchRules: {
      type: 'word',
      pattern: /(?:^|\s|[.,!?;:।"'—])(rama|ram|राम|रामा)(?=$|\s|[.,!?;:।"'—])/gi,
    }
  },
  {
    id: 'om_namah_shivaya',
    name: 'Om Namah Shivaya',
    sanskrit: 'ॐ नमः शिवाय',
    transliteration: 'Oṃ Namaḥ Śivāya',
    meaning: 'I bow to Lord Shiva, the inner auspicious Self',
    defaultLang: 'hi-IN',
    category: 'Panchakshari Mantra',
    beadsPerMala: 108,
    type: 'phrase',
    phrases: [
      // English phrases
      'om namah shivaya',
      'om namah shivay',
      'om namo shivaya',
      'om namo shivay',
      'om namashivaya',
      'om namashivay',
      'namah shivaya',
      'namah shivay',
      // Devanagari phrases
      'ॐ नमः शिवाय',
      'ॐ नम शिवाय',
      'ओम नमः शिवाय',
      'ओम नम शिवाय',
      'नमः शिवाय',
      'नम शिवाय',
      'हर हर महादेव'
    ]
  },
  {
    id: 'hare_krishna',
    name: 'Hare Krishna',
    sanskrit: 'हरे कृष्ण',
    transliteration: 'Hare Kṛṣṇa Mahā-mantra',
    meaning: 'O Lord, O Energy of the Lord, please engage me in Your service',
    defaultLang: 'en-IN',
    category: 'Maha Mantra',
    beadsPerMala: 108,
    type: 'phrase',
    phrases: [
      // Full Maha Mantra in English
      'hare krishna hare krishna krishna krishna hare hare hare rama hare rama rama rama hare hare',
      // Full Maha Mantra in Devanagari
      'हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे हरे राम हरे राम राम राम हरे हरे',
      // Half Maha Mantra
      'hare krishna hare krishna krishna krishna hare hare',
      'हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे',
      'hare rama hare rama rama rama hare hare',
      'हरे राम हरे राम राम राम हरे हरे',
      // Standard 2-word phrase
      'hare krishna',
      'हरे कृष्ण',
      'हरे कृष्णा',
      'hare rama',
      'हरे राम'
    ]
  },
  {
    id: 'gayatri_mantra',
    name: 'Gayatri Mantra',
    sanskrit: 'गायत्री मंत्र',
    transliteration: 'Oṃ Bhūr Bhuvaḥ Svaḥ',
    meaning: 'We meditate on the transcendent Glory of the Sun of spiritual illumination',
    defaultLang: 'hi-IN',
    category: 'Vedic Mantra',
    beadsPerMala: 108,
    type: 'phrase',
    phrases: [
      // Full Sanskrit Gayatri Mantra
      'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्',
      'ॐ भूर्भुवः स्वः तत् सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्',
      'om bhur bhuvah svah tat savitur varenyam bhargo devasya dhimahi dhiyo yo nah prachodayat',
      'om bhur bhuva swaha tat savitur varenyam bhargo devasya dhimahi dhiyo yo nah prachodayat',
      'om bhur bhuva swaha',
      'om bhur bhuvah svah',
      'ॐ भूर्भुवः स्वः',
      'tat savitur varenyam',
      'तत्सवितुर्वरेण्यं',
      'gayatri mantra',
      'गायत्री मंत्र'
    ]
  }
];

export const DEFAULT_MANTRA_ID = 'rama';

/**
 * Normalizes text for voice matching (handles case, accents, and punctuation)
 */
export function normalizeVoiceText(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'।!?,’‘“”]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Counts occurrences of the selected mantra within a transcript.
 * - For word-based mantras (like Rama): counts occurrences of "rama" or "ram", including repeated words like "Rama Rama Rama" => 3.
 * - For phrase-based mantras: matches the longest valid phrase first, avoids double counting sub-words, and counts repeated phrases.
 *
 * @param {string} rawTranscript - The recognized finalized speech transcript.
 * @param {string} mantraId - The identifier of the mantra.
 * @returns {number} The number of valid mantra counts found.
 */
export function countMantraOccurrences(rawTranscript, mantraId) {
  if (!rawTranscript || typeof rawTranscript !== 'string') return 0;
  const mantra = MANTRAS.find(m => m.id === mantraId);
  if (!mantra) return 0;

  const normalized = normalizeVoiceText(rawTranscript);
  if (!normalized) return 0;

  if (mantra.type === 'word') {
    // Specifically for Rama: match 'ram', 'rama', 'राम', 'रामा'
    // Split into words, handling both English and Devanagari
    const tokens = normalized.split(/\s+/);
    let count = 0;
    const validWords = new Set(['rama', 'ram', 'raam', 'raama', 'राम', 'रामा']);
    
    for (const token of tokens) {
      if (validWords.has(token)) {
        count++;
      } else {
        // Also handle cases where punctuation or prefix attached like "shreeram"
        if (token === 'श्रीराम' || token === 'sriram' || token === 'shreeram') {
          count++;
        }
      }
    }
    return count;
  }

  // Phrase-based matching: Sort phrases by descending length so longer phrases match first
  if (mantra.phrases && mantra.phrases.length > 0) {
    const sortedPhrases = [...mantra.phrases]
      .map(p => normalizeVoiceText(p))
      .filter(Boolean)
      .sort((a, b) => b.length - a.length);

    let workingText = ' ' + normalized + ' ';
    let count = 0;

    for (const phrase of sortedPhrases) {
      const phraseWithBoundaries = ' ' + phrase + ' ';
      let index = workingText.indexOf(phraseWithBoundaries);

      while (index !== -1) {
        count++;
        // Replace matched phrase with whitespace placeholder to prevent re-matching or substring collision
        const before = workingText.substring(0, index);
        const after = workingText.substring(index + phrase.length + 1);
        workingText = before + ' ' + after;
        index = workingText.indexOf(phraseWithBoundaries);
      }
    }

    return count;
  }

  return 0;
}
