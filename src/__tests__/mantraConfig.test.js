import { describe, it, expect } from 'vitest';
import { countMantraOccurrences, normalizeVoiceText } from '../utils/mantraConfig';

describe('Mantra Voice Matching Logic', () => {
  it('correctly matches repeated occurrences of Rama: "Rama Rama Rama" => 3', () => {
    const transcript = 'Rama Rama Rama';
    const count = countMantraOccurrences(transcript, 'rama');
    expect(count).toBe(3);
  });

  it('recognizes both Rama and Ram as valid counting words', () => {
    const transcript = 'Ram Rama Ram';
    const count = countMantraOccurrences(transcript, 'rama');
    expect(count).toBe(3);
  });

  it('handles case-insensitivity and punctuation for Rama', () => {
    const transcript = 'rama, RAM! Rama.';
    const count = countMantraOccurrences(transcript, 'rama');
    expect(count).toBe(3);
  });

  it('matches Devanagari text for Rama: "राम राम राम" => 3', () => {
    const transcript = 'राम राम राम';
    const count = countMantraOccurrences(transcript, 'rama');
    expect(count).toBe(3);
  });

  it('does not count unrelated words for Rama', () => {
    const transcript = 'hello how are you testing audio';
    const count = countMantraOccurrences(transcript, 'rama');
    expect(count).toBe(0);
  });

  it('does not count partial words or sub-words as Rama', () => {
    const transcript = 'pyramid camera program';
    const count = countMantraOccurrences(transcript, 'rama');
    expect(count).toBe(0);
  });

  it('matches Om Namah Shivaya phrases accurately', () => {
    const transcript = 'Om Namah Shivaya Om Namah Shivaya';
    const count = countMantraOccurrences(transcript, 'om_namah_shivaya');
    expect(count).toBe(2);
  });

  it('does not count isolated words of Om Namah Shivaya separately', () => {
    const transcript = 'namah om something shivaya';
    // Isolated words scattered should not form the full mantra phrase
    const count = countMantraOccurrences(transcript, 'om_namah_shivaya');
    expect(count).toBe(0);
  });

  it('matches Devanagari Om Namah Shivaya: "ॐ नमः शिवाय" => 1', () => {
    const transcript = 'ॐ नमः शिवाय';
    const count = countMantraOccurrences(transcript, 'om_namah_shivaya');
    expect(count).toBe(1);
  });

  it('matches Hare Krishna phrases without double counting', () => {
    const transcript = 'Hare Krishna Hare Krishna';
    const count = countMantraOccurrences(transcript, 'hare_krishna');
    expect(count).toBe(2);
  });

  it('matches Gayatri Mantra phrases', () => {
    const transcript = 'Om Bhur Bhuva Swaha Tat Savitur Varenyam';
    const count = countMantraOccurrences(transcript, 'gayatri_mantra');
    expect(count).toBeGreaterThanOrEqual(1);
  });
});
