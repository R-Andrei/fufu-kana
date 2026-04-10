import React, { useEffect } from 'react';

interface KanaReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type KanaScript = 'hiragana' | 'katakana';

interface KanaPairCell {
  hiragana: string;
  katakana: string;
  romaji: string;
  note?: string;
}

interface KanaRowDefinition {
  label: string;
  cells: KanaPairCell[];
}

interface KanaSectionDefinition {
  title: string;
  description: string;
  rows: KanaRowDefinition[];
  collapsible?: boolean;
}

interface KanaDisplayCell {
  kana: string;
  romaji: string;
  note?: string;
}

interface KanaDisplayRow {
  label: string;
  cells: KanaDisplayCell[];
}

interface KanaDisplaySection {
  title: string;
  description: string;
  rows: KanaDisplayRow[];
}

interface KanaStudyTableProps {
  rows: KanaDisplayRow[];
}

interface KanaStudySectionProps {
  section: KanaDisplaySection;
}

const blank = (): KanaPairCell => ({
  hiragana: '',
  katakana: '',
  romaji: '',
});

const sections: KanaSectionDefinition[] = [
  {
    title: 'Basic Gojuon',
    description: 'These are the main kana rows everyone starts with.',
    rows: [
      {
        label: 'Vowels',
        cells: [
          { hiragana: 'あ', katakana: 'ア', romaji: 'a' },
          { hiragana: 'い', katakana: 'イ', romaji: 'i' },
          { hiragana: 'う', katakana: 'ウ', romaji: 'u' },
          { hiragana: 'え', katakana: 'エ', romaji: 'e' },
          { hiragana: 'お', katakana: 'オ', romaji: 'o' },
        ],
      },
      {
        label: 'K',
        cells: [
          { hiragana: 'か', katakana: 'カ', romaji: 'ka' },
          { hiragana: 'き', katakana: 'キ', romaji: 'ki' },
          { hiragana: 'く', katakana: 'ク', romaji: 'ku' },
          { hiragana: 'け', katakana: 'ケ', romaji: 'ke' },
          { hiragana: 'こ', katakana: 'コ', romaji: 'ko' },
        ],
      },
      {
        label: 'S',
        cells: [
          { hiragana: 'さ', katakana: 'サ', romaji: 'sa' },
          { hiragana: 'し', katakana: 'シ', romaji: 'shi' },
          { hiragana: 'す', katakana: 'ス', romaji: 'su' },
          { hiragana: 'せ', katakana: 'セ', romaji: 'se' },
          { hiragana: 'そ', katakana: 'ソ', romaji: 'so' },
        ],
      },
      {
        label: 'T',
        cells: [
          { hiragana: 'た', katakana: 'タ', romaji: 'ta' },
          { hiragana: 'ち', katakana: 'チ', romaji: 'chi' },
          { hiragana: 'つ', katakana: 'ツ', romaji: 'tsu' },
          { hiragana: 'て', katakana: 'テ', romaji: 'te' },
          { hiragana: 'と', katakana: 'ト', romaji: 'to' },
        ],
      },
      {
        label: 'N',
        cells: [
          { hiragana: 'な', katakana: 'ナ', romaji: 'na' },
          { hiragana: 'に', katakana: 'ニ', romaji: 'ni' },
          { hiragana: 'ぬ', katakana: 'ヌ', romaji: 'nu' },
          { hiragana: 'ね', katakana: 'ネ', romaji: 'ne' },
          { hiragana: 'の', katakana: 'ノ', romaji: 'no' },
        ],
      },
      {
        label: 'H',
        cells: [
          { hiragana: 'は', katakana: 'ハ', romaji: 'ha' },
          { hiragana: 'ひ', katakana: 'ヒ', romaji: 'hi' },
          { hiragana: 'ふ', katakana: 'フ', romaji: 'fu' },
          { hiragana: 'へ', katakana: 'ヘ', romaji: 'he' },
          { hiragana: 'ほ', katakana: 'ホ', romaji: 'ho' },
        ],
      },
      {
        label: 'M',
        cells: [
          { hiragana: 'ま', katakana: 'マ', romaji: 'ma' },
          { hiragana: 'み', katakana: 'ミ', romaji: 'mi' },
          { hiragana: 'む', katakana: 'ム', romaji: 'mu' },
          { hiragana: 'め', katakana: 'メ', romaji: 'me' },
          { hiragana: 'も', katakana: 'モ', romaji: 'mo' },
        ],
      },
      {
        label: 'Y',
        cells: [
          { hiragana: 'や', katakana: 'ヤ', romaji: 'ya' },
          blank(),
          { hiragana: 'ゆ', katakana: 'ユ', romaji: 'yu' },
          blank(),
          { hiragana: 'よ', katakana: 'ヨ', romaji: 'yo' },
        ],
      },
      {
        label: 'R',
        cells: [
          { hiragana: 'ら', katakana: 'ラ', romaji: 'ra' },
          { hiragana: 'り', katakana: 'リ', romaji: 'ri' },
          { hiragana: 'る', katakana: 'ル', romaji: 'ru' },
          { hiragana: 'れ', katakana: 'レ', romaji: 're' },
          { hiragana: 'ろ', katakana: 'ロ', romaji: 'ro' },
        ],
      },
      {
        label: 'W',
        cells: [
          { hiragana: 'わ', katakana: 'ワ', romaji: 'wa' },
          blank(),
          blank(),
          blank(),
          { hiragana: 'を', katakana: 'ヲ', romaji: 'wo', note: 'usually pronounced o' },
        ],
      },
      {
        label: 'N',
        cells: [
          { hiragana: 'ん', katakana: 'ン', romaji: 'n' },
        ],
      },
    ],
  },
  {
    title: 'Dakuten and Handakuten',
    description: 'This is where kana shift into sounds like ga, za, da, ba, and pa.',
    collapsible: true,
    rows: [
      {
        label: 'G',
        cells: [
          { hiragana: 'が', katakana: 'ガ', romaji: 'ga' },
          { hiragana: 'ぎ', katakana: 'ギ', romaji: 'gi' },
          { hiragana: 'ぐ', katakana: 'グ', romaji: 'gu' },
          { hiragana: 'げ', katakana: 'ゲ', romaji: 'ge' },
          { hiragana: 'ご', katakana: 'ゴ', romaji: 'go' },
        ],
      },
      {
        label: 'Z',
        cells: [
          { hiragana: 'ざ', katakana: 'ザ', romaji: 'za' },
          { hiragana: 'じ', katakana: 'ジ', romaji: 'ji' },
          { hiragana: 'ず', katakana: 'ズ', romaji: 'zu' },
          { hiragana: 'ぜ', katakana: 'ゼ', romaji: 'ze' },
          { hiragana: 'ぞ', katakana: 'ゾ', romaji: 'zo' },
        ],
      },
      {
        label: 'D',
        cells: [
          { hiragana: 'だ', katakana: 'ダ', romaji: 'da' },
          { hiragana: 'ぢ', katakana: 'ヂ', romaji: 'ji', note: 'rare' },
          { hiragana: 'づ', katakana: 'ヅ', romaji: 'zu', note: 'rare' },
          { hiragana: 'で', katakana: 'デ', romaji: 'de' },
          { hiragana: 'ど', katakana: 'ド', romaji: 'do' },
        ],
      },
      {
        label: 'B',
        cells: [
          { hiragana: 'ば', katakana: 'バ', romaji: 'ba' },
          { hiragana: 'び', katakana: 'ビ', romaji: 'bi' },
          { hiragana: 'ぶ', katakana: 'ブ', romaji: 'bu' },
          { hiragana: 'べ', katakana: 'ベ', romaji: 'be' },
          { hiragana: 'ぼ', katakana: 'ボ', romaji: 'bo' },
        ],
      },
      {
        label: 'P',
        cells: [
          { hiragana: 'ぱ', katakana: 'パ', romaji: 'pa' },
          { hiragana: 'ぴ', katakana: 'ピ', romaji: 'pi' },
          { hiragana: 'ぷ', katakana: 'プ', romaji: 'pu' },
          { hiragana: 'ぺ', katakana: 'ペ', romaji: 'pe' },
          { hiragana: 'ぽ', katakana: 'ポ', romaji: 'po' },
        ],
      },
      {
        label: 'V',
        cells: [
          { hiragana: 'ゔ', katakana: 'ヴ', romaji: 'vu', note: 'mostly loanwords' },
        ],
      },
    ],
  },
  {
    title: 'Combo Sounds',
    description: 'These are the blended sounds made with small ya, yu, and yo, like kya, sha, and ryo.',
    collapsible: true,
    rows: [
      {
        label: 'KY',
        cells: [
          { hiragana: 'きゃ', katakana: 'キャ', romaji: 'kya' },
          { hiragana: 'きゅ', katakana: 'キュ', romaji: 'kyu' },
          { hiragana: 'きょ', katakana: 'キョ', romaji: 'kyo' },
        ],
      },
      {
        label: 'GY',
        cells: [
          { hiragana: 'ぎゃ', katakana: 'ギャ', romaji: 'gya' },
          { hiragana: 'ぎゅ', katakana: 'ギュ', romaji: 'gyu' },
          { hiragana: 'ぎょ', katakana: 'ギョ', romaji: 'gyo' },
        ],
      },
      {
        label: 'SH',
        cells: [
          { hiragana: 'しゃ', katakana: 'シャ', romaji: 'sha' },
          { hiragana: 'しゅ', katakana: 'シュ', romaji: 'shu' },
          { hiragana: 'しょ', katakana: 'ショ', romaji: 'sho' },
        ],
      },
      {
        label: 'J',
        cells: [
          { hiragana: 'じゃ', katakana: 'ジャ', romaji: 'ja' },
          { hiragana: 'じゅ', katakana: 'ジュ', romaji: 'ju' },
          { hiragana: 'じょ', katakana: 'ジョ', romaji: 'jo' },
        ],
      },
      {
        label: 'CH',
        cells: [
          { hiragana: 'ちゃ', katakana: 'チャ', romaji: 'cha' },
          { hiragana: 'ちゅ', katakana: 'チュ', romaji: 'chu' },
          { hiragana: 'ちょ', katakana: 'チョ', romaji: 'cho' },
        ],
      },
      {
        label: 'NY',
        cells: [
          { hiragana: 'にゃ', katakana: 'ニャ', romaji: 'nya' },
          { hiragana: 'にゅ', katakana: 'ニュ', romaji: 'nyu' },
          { hiragana: 'にょ', katakana: 'ニョ', romaji: 'nyo' },
        ],
      },
      {
        label: 'HY',
        cells: [
          { hiragana: 'ひゃ', katakana: 'ヒャ', romaji: 'hya' },
          { hiragana: 'ひゅ', katakana: 'ヒュ', romaji: 'hyu' },
          { hiragana: 'ひょ', katakana: 'ヒョ', romaji: 'hyo' },
        ],
      },
      {
        label: 'BY',
        cells: [
          { hiragana: 'びゃ', katakana: 'ビャ', romaji: 'bya' },
          { hiragana: 'びゅ', katakana: 'ビュ', romaji: 'byu' },
          { hiragana: 'びょ', katakana: 'ビョ', romaji: 'byo' },
        ],
      },
      {
        label: 'PY',
        cells: [
          { hiragana: 'ぴゃ', katakana: 'ピャ', romaji: 'pya' },
          { hiragana: 'ぴゅ', katakana: 'ピュ', romaji: 'pyu' },
          { hiragana: 'ぴょ', katakana: 'ピョ', romaji: 'pyo' },
        ],
      },
      {
        label: 'MY',
        cells: [
          { hiragana: 'みゃ', katakana: 'ミャ', romaji: 'mya' },
          { hiragana: 'みゅ', katakana: 'ミュ', romaji: 'myu' },
          { hiragana: 'みょ', katakana: 'ミョ', romaji: 'myo' },
        ],
      },
      {
        label: 'RY',
        cells: [
          { hiragana: 'りゃ', katakana: 'リャ', romaji: 'rya' },
          { hiragana: 'りゅ', katakana: 'リュ', romaji: 'ryu' },
          { hiragana: 'りょ', katakana: 'リョ', romaji: 'ryo' },
        ],
      },
    ],
  },
  {
    title: 'Small Kana and Marks',
    description: 'Small kana, little tsu, and other marks that show up all the time in real words.',
    collapsible: true,
    rows: [
      {
        label: 'Small vowels',
        cells: [
          { hiragana: 'ぁ', katakana: 'ァ', romaji: 'a' },
          { hiragana: 'ぃ', katakana: 'ィ', romaji: 'i' },
          { hiragana: 'ぅ', katakana: 'ゥ', romaji: 'u' },
          { hiragana: 'ぇ', katakana: 'ェ', romaji: 'e' },
          { hiragana: 'ぉ', katakana: 'ォ', romaji: 'o' },
        ],
      },
      {
        label: 'Small y',
        cells: [
          { hiragana: 'ゃ', katakana: 'ャ', romaji: 'ya' },
          { hiragana: 'ゅ', katakana: 'ュ', romaji: 'yu' },
          { hiragana: 'ょ', katakana: 'ョ', romaji: 'yo' },
          { hiragana: 'ゎ', katakana: 'ヮ', romaji: 'wa', note: 'rare' },
        ],
      },
      {
        label: 'Special',
        cells: [
          { hiragana: 'っ', katakana: 'ッ', romaji: 'small tsu', note: 'double consonant' },
          { hiragana: 'ゕ', katakana: 'ヵ', romaji: 'small ka', note: 'rare' },
          { hiragana: 'ゖ', katakana: 'ヶ', romaji: 'small ke', note: 'rare' },
          { hiragana: 'ー', katakana: 'ー', romaji: 'long vowel mark', note: 'mostly katakana' },
          { hiragana: '・', katakana: '・', romaji: 'middle dot', note: 'separator' },
        ],
      },
    ],
  },
  {
    title: 'Loanword Extras',
    description: 'Extra combinations that come up in foreign names, borrowed words, and modern katakana.',
    collapsible: true,
    rows: [
      {
        label: 'F',
        cells: [
          { hiragana: 'ふぁ', katakana: 'ファ', romaji: 'fa' },
          { hiragana: 'ふぃ', katakana: 'フィ', romaji: 'fi' },
          { hiragana: 'ふぇ', katakana: 'フェ', romaji: 'fe' },
          { hiragana: 'ふぉ', katakana: 'フォ', romaji: 'fo' },
          { hiragana: 'ふゅ', katakana: 'フュ', romaji: 'fyu' },
        ],
      },
      {
        label: 'V',
        cells: [
          { hiragana: 'ゔぁ', katakana: 'ヴァ', romaji: 'va' },
          { hiragana: 'ゔぃ', katakana: 'ヴィ', romaji: 'vi' },
          { hiragana: 'ゔ', katakana: 'ヴ', romaji: 'vu' },
          { hiragana: 'ゔぇ', katakana: 'ヴェ', romaji: 've' },
          { hiragana: 'ゔぉ', katakana: 'ヴォ', romaji: 'vo' },
        ],
      },
      {
        label: 'T/D',
        cells: [
          { hiragana: 'てぃ', katakana: 'ティ', romaji: 'ti' },
          { hiragana: 'とぅ', katakana: 'トゥ', romaji: 'tu' },
          { hiragana: 'でぃ', katakana: 'ディ', romaji: 'di' },
          { hiragana: 'どぅ', katakana: 'ドゥ', romaji: 'du' },
          { hiragana: 'てゅ', katakana: 'テュ', romaji: 'tyu' },
        ],
      },
      {
        label: 'SH/J/CH',
        cells: [
          { hiragana: 'しぇ', katakana: 'シェ', romaji: 'she' },
          { hiragana: 'じぇ', katakana: 'ジェ', romaji: 'je' },
          { hiragana: 'ちぇ', katakana: 'チェ', romaji: 'che' },
          { hiragana: 'すぃ', katakana: 'スィ', romaji: 'si' },
          { hiragana: 'ずぃ', katakana: 'ズィ', romaji: 'zi' },
        ],
      },
      {
        label: 'TS/W',
        cells: [
          { hiragana: 'つぁ', katakana: 'ツァ', romaji: 'tsa' },
          { hiragana: 'つぃ', katakana: 'ツィ', romaji: 'tsi' },
          { hiragana: 'つぇ', katakana: 'ツェ', romaji: 'tse' },
          { hiragana: 'つぉ', katakana: 'ツォ', romaji: 'tso' },
          { hiragana: 'うぉ', katakana: 'ウォ', romaji: 'wo' },
        ],
      },
      {
        label: 'W/KW/GW',
        cells: [
          { hiragana: 'うぃ', katakana: 'ウィ', romaji: 'wi' },
          { hiragana: 'うぇ', katakana: 'ウェ', romaji: 'we' },
          { hiragana: 'くぁ', katakana: 'クァ', romaji: 'kwa' },
          { hiragana: 'くぃ', katakana: 'クィ', romaji: 'kwi' },
          { hiragana: 'ぐぁ', katakana: 'グァ', romaji: 'gwa' },
        ],
      },
    ],
  },
  {
    title: 'Older and Rare Kana',
    description: 'Older kana and repeat marks that still pop up now and then in names or stylized writing.',
    collapsible: true,
    rows: [
      {
        label: 'Historic',
        cells: [
          { hiragana: 'ゐ', katakana: 'ヰ', romaji: 'wi', note: 'obsolete' },
          { hiragana: 'ゑ', katakana: 'ヱ', romaji: 'we', note: 'obsolete' },
        ],
      },
      {
        label: 'Repeat',
        cells: [
          { hiragana: 'ゝ', katakana: 'ヽ', romaji: 'repeat', note: 'iteration mark' },
          { hiragana: 'ゞ', katakana: 'ヾ', romaji: 'voiced repeat', note: 'iteration mark' },
        ],
      },
    ],
  },
];

const buildScriptSections = (script: KanaScript): KanaDisplaySection[] => {
  return sections.map((section) => ({
    title: section.title,
    description: section.description,
    rows: section.rows.map((row) => ({
      label: row.label,
      cells: row.cells.map((cell) => ({
        kana: script === 'hiragana' ? cell.hiragana : cell.katakana,
        romaji: cell.romaji,
        note: cell.note,
      })),
    })),
  }));
};

const hiraganaSections = buildScriptSections('hiragana');
const katakanaSections = buildScriptSections('katakana');
const hiraganaCore = hiraganaSections[0]!;
const katakanaCore = katakanaSections[0]!;
const hiraganaAdditional = hiraganaSections.slice(1);
const katakanaAdditional = katakanaSections.slice(1);

const KanaStudyTable: React.FC<KanaStudyTableProps> = ({ rows }) => (
  <div className="kana-table">
    {rows.map((row, rowIndex) => (
      <div className="kana-row" key={`${row.label}-${rowIndex}`}>
        <div className="kana-row-label">{row.label}</div>
        <div
          className="kana-row-cells"
          style={{ gridTemplateColumns: `repeat(${row.cells.length}, minmax(0, 1fr))` }}
        >
          {row.cells.map((cell, index) => {
            const isEmpty = !cell.kana;

            return (
              <div
                className={`kana-cell${isEmpty ? ' kana-cell-empty' : ''}`}
                key={`${row.label}-${index}-${cell.kana || 'empty'}`}
                title={!isEmpty && cell.note ? cell.note : undefined}
              >
                {!isEmpty && (
                  <>
                    <span className="kana-cell-kana">{cell.kana}</span>
                    <span className="kana-cell-romaji">{cell.romaji}</span>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    ))}
  </div>
);

const KanaStudySection: React.FC<KanaStudySectionProps> = ({ section }) => (
  <section className="kana-extra-section">
    <div className="kana-extra-section-header">
      <h5>{section.title}</h5>
      <p>{section.description}</p>
    </div>
    <KanaStudyTable rows={section.rows} />
  </section>
);

const KanaReferenceModal: React.FC<KanaReferenceModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="kana-modal-overlay" onClick={onClose}>
      <div
        className="kana-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="kana-modal-title"
      >
        <div className="kana-modal-header">
          <div>
            <p className="kana-modal-eyebrow">Kana Guide</p>
            <h3 id="kana-modal-title">Kana Study Chart</h3>
            <p className="kana-modal-description">
              A quick reference for the main kana, plus dakuten, combos, and the other extras.
            </p>
          </div>
          <button
            type="button"
            className="kana-modal-close"
            onClick={onClose}
            aria-label="Close kana reference"
          >
            Close
          </button>
        </div>

        <div className="kana-modal-body">
          <div className="kana-core-grid">
            <section className="kana-script-panel kana-script-panel-hiragana">
              <div className="kana-script-panel-header">
                <div>
                  <p className="kana-script-label">Hiragana</p>
                  <h4>Core chart</h4>
                </div>
                <span className="kana-script-hint">everyday Japanese</span>
              </div>
              <div className="kana-script-core">
                <KanaStudyTable rows={hiraganaCore.rows} />
              </div>
            </section>

            <section className="kana-script-panel kana-script-panel-katakana">
              <div className="kana-script-panel-header">
                <div>
                  <p className="kana-script-label">Katakana</p>
                  <h4>Core chart</h4>
                </div>
                <span className="kana-script-hint">loanwords and names</span>
              </div>
              <div className="kana-script-core">
                <KanaStudyTable rows={katakanaCore.rows} />
              </div>
            </section>
          </div>

          <details className="kana-drawer">
            <summary className="kana-drawer-summary">
              <span className="kana-drawer-summary-text">
                <strong>More Kana</strong>
                <small>Dakuten, combo sounds, small kana, loanword extras, and older forms</small>
              </span>
            </summary>
            <div className="kana-drawer-content">
              <div className="kana-drawer-grid">
                <section className="kana-script-panel kana-script-panel-hiragana kana-script-panel-drawer">
                  <div className="kana-script-panel-header">
                    <div>
                      <p className="kana-script-label">Hiragana</p>
                      <h4>Extra sets</h4>
                    </div>
                  </div>
                  <div className="kana-script-scroll">
                    {hiraganaAdditional.map((section) => (
                      <KanaStudySection key={section.title} section={section} />
                    ))}
                  </div>
                </section>

                <section className="kana-script-panel kana-script-panel-katakana kana-script-panel-drawer">
                  <div className="kana-script-panel-header">
                    <div>
                      <p className="kana-script-label">Katakana</p>
                      <h4>Extra sets</h4>
                    </div>
                  </div>
                  <div className="kana-script-scroll">
                    {katakanaAdditional.map((section) => (
                      <KanaStudySection key={section.title} section={section} />
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};

export default KanaReferenceModal;
