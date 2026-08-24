"use client"

import {
  FIELD_LABELS,
  GRADES,
  RESULT_OPTIONS,
  type GameField,
  type GameValues,
} from "../lib/gameValidation"
import type { Suggestions } from "../lib/useSuggestions"

type Props = {
  values: GameValues
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void
  suggestions: Suggestions
  autoFilled?: GameField[]
}

// 自動入力された項目は色を変えて見分けられるようにする
function fieldClass(isAutoFilled: boolean) {
  return `border p-2 w-full rounded ${
    isAutoFilled ? "border-blue-400 bg-blue-50" : ""
  }`
}

export default function GameFormFields({
  values,
  onChange,
  suggestions,
  autoFilled = [],
}: Props) {
  const isAuto = (field: GameField) => autoFilled.includes(field)

  return (
    <>
      {/* 入力候補（既に登録されている表記から選べるようにする） */}
      <datalist id="name-suggestions">
        {suggestions.names.map((name) => (
          <option key={name} value={name} />
        ))}
      </datalist>
      <datalist id="univ-suggestions">
        {suggestions.universities.map((univ) => (
          <option key={univ} value={univ} />
        ))}
      </datalist>
      <datalist id="event-suggestions">
        {suggestions.events.map((event) => (
          <option key={event} value={event} />
        ))}
      </datalist>

      {(["sente", "gote"] as const).map((side) => {
        const nameField = `${side}_name` as GameField
        const univField = `${side}_univ` as GameField
        const gradeField = `${side}_grade` as GameField

        return (
          <div key={side}>
            <label className="block font-semibold mb-1">
              {side === "sente" ? "先手" : "後手"}
            </label>
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
              <input
                type="text"
                name={nameField}
                list="name-suggestions"
                required
                value={values[nameField]}
                onChange={onChange}
                className={fieldClass(isAuto(nameField))}
                placeholder="氏名"
              />
              <input
                type="text"
                name={univField}
                list="univ-suggestions"
                required
                value={values[univField]}
                onChange={onChange}
                className={fieldClass(isAuto(univField))}
                placeholder="大学名"
              />
              <select
                name={gradeField}
                required
                value={values[gradeField]}
                onChange={onChange}
                className={fieldClass(isAuto(gradeField))}
                aria-label={FIELD_LABELS[gradeField]}
              >
                <option value="">学年を選択</option>
                {GRADES.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )
      })}

      <div>
        <label className="block font-semibold mb-1">大会情報</label>
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
          <input
            type="text"
            name="event"
            list="event-suggestions"
            required
            value={values.event}
            onChange={onChange}
            className={fieldClass(isAuto("event"))}
            placeholder="大会名"
          />
          <input
            type="date"
            name="date"
            required
            value={values.date}
            onChange={onChange}
            className={fieldClass(isAuto("date"))}
            aria-label={FIELD_LABELS.date}
          />
          <select
            name="result"
            required
            value={values.result}
            onChange={onChange}
            className={fieldClass(isAuto("result"))}
            aria-label={FIELD_LABELS.result}
          >
            <option value="">結果を選択</option>
            {RESULT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  )
}
