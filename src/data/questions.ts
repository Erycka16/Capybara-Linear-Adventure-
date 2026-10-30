import { LevelConfig, Level1Question, Level2Question, Level3ClassroomQuestion } from '../types/game';

export const LEVEL_CONFIGS: Record<number, LevelConfig> = {
  1: {
    level: 1,
    title: 'Tahap 1: Cari Nilai (X, Y) Dua Persamaan',
    subtitle: 'Pemasa Keseluruhan: 2 Minit ⏱️',
    description: '5 nyawa. Masa 2 minit (120 saat) untuk keseluruhan tahap. Sekiranya masa tidak mencukupi, anda boleh menambah masa (+60s) dengan menolak 1 nyawa!',
    color: '#10B981',
    bgGradient: 'from-emerald-400 via-teal-200 to-amber-100',
    targetQuestions: 5,
    baseFlightSpeed: 100,
    boostFlightSpeed: 330,
    slowFlightSpeed: 45,
    gravity: 380,
    flapStrength: -210,
    spawnDistance: 1100,
  },
  2: {
    level: 2,
    title: 'Tahap 2: Bentukkan Persamaan Linear Dari Ayat',
    subtitle: '10 Saat Meneliti Setiap Soalan Baharu 🧠',
    description: '5 nyawa. Diberikan masa 10 saat untuk meneliti dan memahami setiap soalan baharu sebelum mula terbang! Petak jawapan kini lebih besar dan jelas.',
    color: '#3B82F6',
    bgGradient: 'from-blue-500 via-sky-300 to-amber-100',
    targetQuestions: 5,
    baseFlightSpeed: 105,
    boostFlightSpeed: 340,
    slowFlightSpeed: 48,
    gravity: 400,
    flapStrength: -220,
    spawnDistance: 1200,
  },
  3: {
    level: 3,
    title: 'Tahap 3: 4 Pintu Bilik Pembelajaran & Graf Bersilang',
    subtitle: 'Kumpul 5 Oren → Masuk Bilik Tema → Plot Graf & Kunci Emas 🍊🗝️',
    description: 'Kumpul 5 biji oren untuk membuka setiap pintu (Pintu 1: Perpustakaan, Pintu 2: Sekolah, Pintu 3: Muzium, Pintu 4: Hari Sukan). Masuk ke dalam scene bilik bertema dan selesaikan persamaan dengan plot graf!',
    color: '#F97316',
    bgGradient: 'from-orange-500 via-amber-300 to-rose-200',
    targetQuestions: 4, // 4 Doors
    baseFlightSpeed: 100,
    boostFlightSpeed: 330,
    slowFlightSpeed: 45,
    gravity: 400,
    flapStrength: -215,
    spawnDistance: 1250,
  },
};

// ================= LEVEL 1 QUESTIONS (PDF Page 1) =================
export const LEVEL_1_DATA: Level1Question[] = [
  {
    id: 'l1_1',
    eq1: 'x + y = 7',
    eq2: '2x + y = 12',
    displayQuestion: 'Diberi: x + y = 7 dan 2x + y = 12. Cari nilai (x, y):',
    options: ['(5, 2)', '(4, 3)', '(2, 5)'],
    correctIndex: 0,
    correctCoord: [5, 2],
    explanation: '2x + y - (x + y) = 12 - 7 ⇒ x = 5. Kemudian y = 7 - 5 = 2. Jawapan: (5, 2).',
  },
  {
    id: 'l1_2',
    eq1: 'x + y = 6',
    eq2: 'x - y = 2',
    displayQuestion: 'Diberi: x + y = 6 dan x - y = 2. Cari nilai (x, y):',
    options: ['(3, 3)', '(4, 2)', '(5, 1)'],
    correctIndex: 1,
    correctCoord: [4, 2],
    explanation: 'Tambah kedua-dua persamaan: 2x = 8 ⇒ x = 4. Maka y = 6 - 4 = 2. Jawapan: (4, 2).',
  },
  {
    id: 'l1_3',
    eq1: 'x + y = 8',
    eq2: '2x + y = 14',
    displayQuestion: 'Diberi: x + y = 8 dan 2x + y = 14. Cari nilai (x, y):',
    options: ['(6, 2)', '(5, 3)', '(4, 4)'],
    correctIndex: 0,
    correctCoord: [6, 2],
    explanation: '(2x + y) - (x + y) = 14 - 8 ⇒ x = 6. Maka y = 8 - 6 = 2. Jawapan: (6, 2).',
  },
  {
    id: 'l1_4',
    eq1: 'x + y = 10',
    eq2: 'x - y = 4',
    displayQuestion: 'Diberi: x + y = 10 dan x - y = 4. Cari nilai (x, y):',
    options: ['(6, 4)', '(7, 3)', '(8, 2)'],
    correctIndex: 1,
    correctCoord: [7, 3],
    explanation: '2x = 14 ⇒ x = 7. Maka y = 10 - 7 = 3. Jawapan: (7, 3).',
  },
  {
    id: 'l1_5',
    eq1: '2x + y = 8',
    eq2: 'x + y = 5',
    displayQuestion: 'Diberi: 2x + y = 8 dan x + y = 5. Cari nilai (x, y):',
    options: ['(2, 3)', '(4, 1)', '(3, 2)'],
    correctIndex: 2,
    correctCoord: [3, 2],
    explanation: '(2x + y) - (x + y) = 8 - 5 ⇒ x = 3. Maka y = 5 - 3 = 2. Jawapan: (3, 2).',
  },
];

// ================= LEVEL 2 QUESTIONS (PDF Page 1) =================
export const LEVEL_2_DATA: Level2Question[] = [
  {
    id: 'l2_1',
    story: 'Faizah menternak sejumlah 7 ekor ayam (x) dan itik (y) di sebuah reban. Kos menternak seekor ayam ialah RM2 seminggu manakala kos menternak seekor itik ialah RM1 seminggu. Jumlah kos ternakan bagi ayam dan itik ialah RM12 seminggu.',
    question: 'Berapakah persamaan linear yang mewakili situasi di atas?',
    options: ['x + y = 7, 2x + y = 12', 'x + y = 12, 2x + y = 7', '2x + 2y = 7, x + y = 12'],
    correctIndex: 0,
    explanation: 'Jumlah haiwan: x + y = 7. Jumlah kos: 2x + 1y = 12. Jawapan: x + y = 7, 2x + y = 12.',
  },
  {
    id: 'l2_2',
    story: 'Pada Hari Keusahawanan di sebuah sekolah, 800 naskhah kupon telah dijual. Harga senaskhah kupon masing-masing ialah RM30 (x) dan RM50 (y). Jumlah wang yang diperoleh ialah RM30,000.',
    question: 'Bentukkan pasangan persamaan linear yang tepat:',
    options: ['x + y = 3000, 30x + 50y = 800', 'x + y = 800, 3x + 5y = 3000', 'x + y = 800, 5x + 3y = 3000'],
    correctIndex: 1,
    explanation: 'Jumlah kupon: x + y = 800. Jumlah jualan: 30x + 50y = 30000 ⇒ 3x + 5y = 3000.',
  },
  {
    id: 'l2_3',
    story: 'Panjang sebuah kolam renang yang berbentuk segi empat tepat ialah p m dan lebarnya ialah q m. Diberi bahawa panjang kolam renang itu adalah dua kali lebarnya. Jika perimeter kolam renang itu ialah 150 m.',
    question: 'Bentukkan persamaan linear bagi situasi kolam renang ini:',
    options: ['p + 2q = 0, p + q = 150', 'p - 2q = 0, p + q = 75', '2p + q = 75, p - q = 0'],
    correctIndex: 1,
    explanation: 'Panjang 2 kali lebar: p = 2q ⇒ p - 2q = 0. Perimeter: 2(p + q) = 150 ⇒ p + q = 75.',
  },
  {
    id: 'l2_4',
    story: 'Beza antara dua nombor ialah 5. Apabila nombor yang lebih besar didarab dengan 2, hasil tambah kedua-dua nombor itu ialah 7.',
    question: 'Tentukan persamaan linear yang betul:',
    options: ['x - y = 5, 2x + y = 7', 'x + y = 5, 2x - y = 7', 'x - y = 7, 2x + y = 5'],
    correctIndex: 0,
    explanation: 'Beza dua nombor: x - y = 5. Nombor besar didarab 2 dan ditambah nombor kedua: 2x + y = 7.',
  },
  {
    id: 'l2_5',
    story: 'Katakan umur ayah Devaki sekarang adalah X dan umur Devaki sekarang adalah Y. Selepas enam tahun, umur ayah Devaki adalah tiga kali umur Devaki. Jika pada dua tahun yang lalu, umur ayah Devaki adalah tujuh kali umur Devaki.',
    question: 'Bentukkan pasangan persamaan linear berikut:',
    options: ['x - 3y = 12, x - 7y = 12', 'x + 3y = 12, x + 7y = 12', '3x - y = 12, 7x - y = 12'],
    correctIndex: 0,
    explanation: 'X + 6 = 3(Y + 6) ⇒ X - 3Y = 12. X - 2 = 7(Y - 2) ⇒ X - 7Y = 12.',
  },
];

// ================= LEVEL 3 SCENE QUESTIONS (Matching Image & PDF Page 2) =================
export const LEVEL_3_CLASSROOM_DATA: Level3ClassroomQuestion[] = [
  {
    doorNumber: 1,
    doorTitle: 'Pintu 1 : Kamus Puan Siti',
    theme: 'library',
    story: 'Puan Siti ingin menghadiahi muridnya dengan 6 buah kamus bahasa Melayu (x) dan kamus bahasa Inggeris (y). Harga sebuah kamus bahasa Melayu dan sebuah kamus bahasa Inggeris masing-masing ialah RM20 dan RM40. Puan Siti membeli x buah kamus bahasa Melayu dan y buah kamus bahasa Inggeris dengan jumlah bayaran RM160.',
    equationOptions: [
      'x + y = 6 , 2x + 4y = 16',
      'x + y = 16 , 2x + 4y = 6',
      '2x + y = 6 , x + 4y = 16',
    ],
    correctEqIndex: 0,
    correctPoint: [4, 2],
    eq1Label: 'x + y = 6',
    eq2Label: '2x + 4y = 16',
    xRange: [0, 8],
    yRange: [0, 6],
    explanation: 'x + y = 6 dan 20x + 40y = 160 (bahagi 10 jadi 2x + 4y = 16). Titik persilangan pada graf ialah (4, 2).',
  },
  {
    doorNumber: 2,
    doorTitle: 'Pintu 2 : 20 Murid Lelaki & Perempuan',
    theme: 'school',
    story: 'Seramai 20 orang murid yang terdiri daripada murid lelaki (x) dan murid perempuan (y) dibahagikan sama rata kepada dua kumpulan (10 orang setiap kumpulan). Bilangan murid lelaki di dalam setiap kumpulan adalah 2 orang lebih daripada bilangan murid perempuan.',
    equationOptions: [
      'x + y = 20 , x - y = 4',
      'x + y = 10 , x - y = 2',
      'x - y = 10 , x + y = 2',
    ],
    correctEqIndex: 1,
    correctPoint: [6, 4],
    eq1Label: 'x + y = 10',
    eq2Label: 'x - y = 2',
    xRange: [0, 12],
    yRange: [0, 8],
    explanation: 'Setiap kumpulan ada 10 murid: x + y = 10. Lelaki 2 orang lebih: x - y = 2. Titik persilangan graf ialah (6, 4).',
  },
  {
    doorNumber: 3,
    doorTitle: 'Pintu 3 : Tiket Muzium Danish & Alia',
    theme: 'museum',
    story: 'Perbualan antara Danish dan Alia:\nDanish: “Alia kita sudah membeli 8 tiket muzium. Berapa harga tiket dewasa dan tiket kanak-kanak?”\nAlia: “Harga tiket dewasa ialah RM10 lebih mahal daripada tiket kanak-kanak. Jumlah bayaran kita ialah RM60.”\nBerapakah bilangan tiket bagi setiap jenis yang dibeli? (dewasa = x, kanak-kanak = y)',
    equationOptions: [
      'x + y = 8 , 2x + y = 12',
      'x + y = 12 , 2x + y = 8',
      'x - y = 8 , x + 2y = 12',
    ],
    correctEqIndex: 0,
    correctPoint: [4, 4],
    eq1Label: 'x + y = 8',
    eq2Label: '2x + y = 12',
    xRange: [0, 10],
    yRange: [0, 10],
    explanation: 'Persamaan: x + y = 8 dan 2x + y = 12. Titik persilangan graf di mana garis bertemu ialah (4, 4).',
  },
  {
    doorNumber: 4,
    doorTitle: 'Pintu 4 : Hari Sukan Pasukan Merah & Biru',
    theme: 'sports',
    story: 'Sempena Hari Sukan Sekolah, seramai 24 orang murid menyertai dua pasukan, iaitu pasukan Merah (x) dan pasukan Biru (y). Bilangan murid dalam pasukan Merah adalah dua kali bilangan murid dalam pasukan Biru selepas 4 orang murid berpindah dari pasukan Biru ke pasukan Merah. Berapakah bilangan murid dalam setiap pasukan pada awalnya?',
    equationOptions: [
      'x + y = 24 , x - 2y = -12',
      'x + y = 12 , 2x - y = 24',
      'x - y = 24 , x + 2y = 12',
    ],
    correctEqIndex: 0,
    correctPoint: [12, 12],
    eq1Label: 'x + y = 24',
    eq2Label: 'x - 2y = -12',
    xRange: [0, 26],
    yRange: [0, 26],
    explanation: 'x + y = 24. Selepas pindah 4 orang: (x + 4) = 2(y - 4) ⇒ x - 2y = -12. Titik persilangan graf ialah (12, 12).',
  },
];

// Utility to shuffle answer options randomly so students cannot memorize positions
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function getShuffledLevel1Questions(): Level1Question[] {
  return LEVEL_1_DATA.map((q) => {
    const correctVal = q.options[q.correctIndex];
    const shuffled = shuffleArray(q.options);
    return {
      ...q,
      options: shuffled,
      correctIndex: shuffled.indexOf(correctVal),
    };
  });
}

export function getShuffledLevel2Questions(): Level2Question[] {
  return LEVEL_2_DATA.map((q) => {
    const correctVal = q.options[q.correctIndex];
    const shuffled = shuffleArray(q.options);
    return {
      ...q,
      options: shuffled,
      correctIndex: shuffled.indexOf(correctVal),
    };
  });
}

export function getShuffledClassroomQuestions(): Level3ClassroomQuestion[] {
  return LEVEL_3_CLASSROOM_DATA.map((q) => {
    const correctVal = q.equationOptions[q.correctEqIndex];
    const shuffled = shuffleArray(q.equationOptions);
    return {
      ...q,
      equationOptions: shuffled,
      correctEqIndex: shuffled.indexOf(correctVal),
    };
  });
}

// Active shuffled question lists that get updated whenever a player finishes or retries
let activeLevel1: Level1Question[] = getShuffledLevel1Questions();
let activeLevel2: Level2Question[] = getShuffledLevel2Questions();
let activeLevel3: Level3ClassroomQuestion[] = getShuffledClassroomQuestions();

export function shuffleAllQuestions() {
  activeLevel1 = getShuffledLevel1Questions();
  activeLevel2 = getShuffledLevel2Questions();
  activeLevel3 = getShuffledClassroomQuestions();
}

export function getActiveLevel1Data(): Level1Question[] {
  return activeLevel1;
}

export function getActiveLevel2Data(): Level2Question[] {
  return activeLevel2;
}

export function getActiveLevel3Data(): Level3ClassroomQuestion[] {
  return activeLevel3;
}

