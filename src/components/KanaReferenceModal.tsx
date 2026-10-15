import React, { useEffect } from 'react';

import { buildScriptSections, type KanaDisplayRow, type KanaDisplaySection } from '../utils/kanaCharts';

interface KanaReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface KanaStudyTableProps {
  rows: KanaDisplayRow[];
}

interface KanaStudySectionProps {
  section: KanaDisplaySection;
}

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
