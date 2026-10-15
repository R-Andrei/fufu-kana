import React, { useEffect, useMemo, useState } from 'react';
import { buildScriptSections, type KanaDisplaySection } from '../utils/kanaCharts';

type CharacterScript = 'hiragana' | 'katakana';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  selectedRowIds: string[];
  onSave: (selectedRowIds: string[]) => void;
};

const makeRowId = (script: CharacterScript, sectionTitle: string, rowLabel: string) =>
  `${script}|${sectionTitle}|${rowLabel}`;

const getAllRowsForScript = (script: CharacterScript) =>
  buildScriptSections(script).flatMap((section) =>
    section.rows.map((row) => makeRowId(script, section.title, row.label)),
  );

const isSectionFullySelected = (
  section: KanaDisplaySection,
  script: CharacterScript,
  selectedSet: Set<string>,
) =>
  section.rows.every((row) => selectedSet.has(makeRowId(script, section.title, row.label)));

const isScriptFullySelected = (script: CharacterScript, selectedSet: Set<string>) =>
  getAllRowsForScript(script).every((rowId) => selectedSet.has(rowId));

const AdvancedKanaSelectionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  selectedRowIds,
  onSave,
}) => {
  const [localSelection, setLocalSelection] = useState<Set<string>>(new Set(selectedRowIds));

  useEffect(() => {
    setLocalSelection(new Set(selectedRowIds));
  }, [selectedRowIds]);

  const hiraganaSections = useMemo(() => buildScriptSections('hiragana'), []);
  const katakanaSections = useMemo(() => buildScriptSections('katakana'), []);

  const toggleRow = (rowId: string) => {
    setLocalSelection((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) next.delete(rowId);
      else next.add(rowId);
      return next;
    });
  };

  const toggleSection = (script: CharacterScript, section: KanaDisplaySection) => {
    setLocalSelection((prev) => {
      const next = new Set(prev);
      const allRowIds = section.rows.map((row) => makeRowId(script, section.title, row.label));
      const sectionSelected = allRowIds.every((rowId) => next.has(rowId));
      if (sectionSelected) {
        allRowIds.forEach((rowId) => next.delete(rowId));
      } else {
        allRowIds.forEach((rowId) => next.add(rowId));
      }
      return next;
    });
  };

  const toggleScript = (script: CharacterScript) => {
    setLocalSelection((prev) => {
      const next = new Set(prev);
      const allRowIds = getAllRowsForScript(script);
      const scriptSelected = allRowIds.every((rowId) => next.has(rowId));
      if (scriptSelected) {
        allRowIds.forEach((rowId) => next.delete(rowId));
      } else {
        allRowIds.forEach((rowId) => next.add(rowId));
      }
      return next;
    });
  };

  const handleSave = () => {
    onSave(Array.from(localSelection));
    onClose();
  };

  const KanaStudySectionWithCheckboxes: React.FC<{
    section: KanaDisplaySection;
    script: CharacterScript;
  }> = ({ section, script }) => {
    const sectionSelected = isSectionFullySelected(section, script, localSelection);

    return (
      <section className="kana-extra-section">
        <div className="kana-extra-section-header">
          <div>
            <h5>{section.title}</h5>
            <p>{section.description}</p>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              checked={sectionSelected}
              onChange={() => toggleSection(script, section)}
            />
            All
          </label>
        </div>
        <div className="kana-table">
          {section.rows.map((row, rowIndex) => {
            const rowId = makeRowId(script, section.title, row.label);
            return (
              <div className="kana-row" key={`${section.title}-${rowIndex}`}>
                <div className="kana-row-label">
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                    <input
                      type="checkbox"
                      checked={localSelection.has(rowId)}
                      onChange={() => toggleRow(rowId)}
                    />
                    {row.label}
                  </label>
                </div>
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
            );
          })}
        </div>
      </section>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="kana-modal-overlay" onClick={onClose}>
      <div
        className="kana-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="advanced-kana-modal-title"
      >
        <div className="kana-modal-header">
          <div>
            <p className="kana-modal-eyebrow">Advanced selection</p>
            <h3 id="advanced-kana-modal-title">Choose rows for practice</h3>
            <p className="kana-modal-description">
              Pick the exact kana rows and sets you want to practice. Select entire scripts, sections, or individual rows.
            </p>
          </div>
          <button
            type="button"
            className="kana-modal-close"
            onClick={onClose}
            aria-label="Close advanced selection"
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
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={isScriptFullySelected('hiragana', localSelection)}
                    onChange={() => toggleScript('hiragana')}
                  />
                  All
                </label>
              </div>
              <div className="kana-script-core">
                <div className="kana-table">
                  {hiraganaSections[0].rows.map((row, rowIndex) => {
                    const rowId = makeRowId('hiragana', hiraganaSections[0].title, row.label);
                    return (
                      <div className="kana-row" key={`${row.label}-${rowIndex}`}>
                        <div className="kana-row-label">
                          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                            <input
                              type="checkbox"
                              checked={localSelection.has(rowId)}
                              onChange={() => toggleRow(rowId)}
                            />
                            {row.label}
                          </label>
                        </div>
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
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="kana-script-panel kana-script-panel-katakana">
              <div className="kana-script-panel-header">
                <div>
                  <p className="kana-script-label">Katakana</p>
                  <h4>Core chart</h4>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={isScriptFullySelected('katakana', localSelection)}
                    onChange={() => toggleScript('katakana')}
                  />
                  All
                </label>
              </div>
              <div className="kana-script-core">
                <div className="kana-table">
                  {katakanaSections[0].rows.map((row, rowIndex) => {
                    const rowId = makeRowId('katakana', katakanaSections[0].title, row.label);
                    return (
                      <div className="kana-row" key={`${row.label}-${rowIndex}`}>
                        <div className="kana-row-label">
                          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                            <input
                              type="checkbox"
                              checked={localSelection.has(rowId)}
                              onChange={() => toggleRow(rowId)}
                            />
                            {row.label}
                          </label>
                        </div>
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
                    );
                  })}
                </div>
              </div>
            </section>
          </div>

          <details className="kana-drawer">
            <summary className="kana-drawer-summary">
              <span className="kana-drawer-summary-text">
                <strong>More Kana</strong>
                <small>Select extra rows and combined kana sets.</small>
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
                    {hiraganaSections.slice(1).map((section) => (
                      <KanaStudySectionWithCheckboxes
                        key={section.title}
                        section={section}
                        script="hiragana"
                      />
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
                    {katakanaSections.slice(1).map((section) => (
                      <KanaStudySectionWithCheckboxes
                        key={section.title}
                        section={section}
                        script="katakana"
                      />
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </details>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} className="kana-modal-close" style={{ background: '#2f3640' }}>
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={localSelection.size === 0}
              style={{
                border: '1px solid #4caf50',
                background: '#4caf50',
                color: '#fff',
                borderRadius: '0.75rem',
                padding: '0.85rem 1.25rem',
              }}
            >
              Save selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedKanaSelectionModal;
