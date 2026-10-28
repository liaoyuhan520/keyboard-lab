import {
  COMPACT_LAYOUT_NOTES,
  INPUT_METHOD_NOTES,
  KEY_REFERENCE_GROUPS,
  KEY_REFERENCE_TOTAL,
  WINDOWS_SHORTCUTS,
} from '../data/reference'

export function ReferenceSections() {
  return (
    <div className="reference-sections">
      <section className="doc-section" id="key-reference">
        <header className="doc-section__heading">
          <div>
            <div className="eyebrow">REFERENCE · {KEY_REFERENCE_TOTAL} KEYS</div>
            <h2>87 键标准键位说明</h2>
          </div>
          <span className="doc-badge">{KEY_REFERENCE_TOTAL} KEYS</span>
        </header>
        <p className="doc-section__lede">
          下方按键盘分区逐键列出标准 87 键布局的作用，作为桌面键盘的通用参考。
        </p>

        <div className="reference-grid">
          {KEY_REFERENCE_GROUPS.map((group) => (
            <article className="reference-group" key={group.id}>
              <header className="reference-group__header">
                <div>
                  <h3>{group.title}</h3>
                  <p>{group.caption}</p>
                </div>
                <span>{group.entries.length}</span>
              </header>
              <dl className="key-reference-list">
                {group.entries.map((entry) => (
                  <div className="key-reference-row" key={`${group.id}-${entry.key}`}>
                    <dt>{entry.key}</dt>
                    <dd>{entry.detail}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>

        <aside className="compact-note">
          <div className="compact-note__label">COMPACT MODEL NOTE</div>
          <h3>当前交互键盘与 87 键标准的差异</h3>
          <ul>
            {COMPACT_LAYOUT_NOTES.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="doc-section" id="shortcuts">
        <header className="doc-section__heading">
          <div>
            <div className="eyebrow eyebrow--cyan">WINDOWS · CHEAT SHEET</div>
            <h2>Windows 常用组合键表</h2>
          </div>
          <span className="doc-badge">{WINDOWS_SHORTCUTS.length} SHORTCUTS</span>
        </header>
        <p className="doc-section__lede">
          高频组合键的用途与注意事项。页面内可直接敲击练习，组合键会优先于单键识别。
        </p>

        <div className="shortcut-table-wrap">
          <table className="shortcut-table">
            <thead>
              <tr>
                <th scope="col">组合键</th>
                <th scope="col">功能</th>
                <th scope="col">说明</th>
              </tr>
            </thead>
            <tbody>
              {WINDOWS_SHORTCUTS.map((shortcut) => (
                <tr key={shortcut.combo}>
                  <th scope="row">
                    <code>{shortcut.combo}</code>
                  </th>
                  <td>{shortcut.action}</td>
                  <td>{shortcut.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="doc-section" id="input-method">
        <header className="doc-section__heading">
          <div>
            <div className="eyebrow">INPUT METHOD · NOTES</div>
            <h2>Shift 与输入法机制</h2>
          </div>
        </header>
        <div className="ime-notes">
          {INPUT_METHOD_NOTES.map((note, index) => (
            <article className="ime-note" key={note}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <p>{note}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
