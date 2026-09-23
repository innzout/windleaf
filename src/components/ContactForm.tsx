'use client'

import { useState, type FormEvent } from 'react'
import {
  FORM_FIELDS,
  AREA_OF_INTEREST,
  FORM_COUNTRIES,
} from '@/content/site'
import { SectionHeading } from '@/components/ui'

type Status = 'idle' | 'success' | 'error'

/**
 * Single source of truth for what makes one field invalid.
 *
 * Both the submit check and the live re-check call this, so a red border can
 * never disagree with what submitting would actually say. Keep new rules here
 * rather than inline in the submit handler.
 */
function fieldError(name: string, raw: string): boolean {
  const value = raw.trim()
  const field = FORM_FIELDS.find((f) => f.name === name)

  if (field?.required && !value) return true
  // Format rules only apply to something typed — an empty optional field is
  // not an error.
  if (!value) return false

  if (name === 'email') return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  if (name === 'phone') return !/^[+]?[\d\s().-]{7,20}$/.test(value)
  if (name === 'requirement') return value.length < 10

  return false
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const data = new FormData(form)

    const nextErrors: Record<string, boolean> = {}

    for (const field of FORM_FIELDS) {
      if (fieldError(field.name, String(data.get(field.name) ?? ''))) {
        nextErrors[field.name] = true
      }
    }

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setStatus('error')
      return
    }

    setStatus('success')
    setErrors({})
    form.reset()
  }

  /**
   * Clear a field's red border as soon as it becomes valid again.
   *
   * The inputs are uncontrolled, so without this nothing re-reads them between
   * submits and a corrected field kept its error styling until the form was
   * submitted a second time. Bound once on the <form>, because change events
   * bubble — every input, select and textarea inside is covered, including any
   * added later.
   */
  function handleFieldEdit(event: FormEvent<HTMLFormElement>) {
    const target = event.target as
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement

    const { name, value } = target
    // Still wrong — keep the border up rather than flickering it off per
    // keystroke and back on at submit.
    if (!name || !errors[name] || fieldError(name, value)) return

    const next = { ...errors }
    delete next[name]
    setErrors(next)

    // Last one fixed: retire the summary message too, or it sits there
    // claiming there are highlighted fields when none are left.
    if (Object.keys(next).length === 0) setStatus('idle')
  }

  const inputCls = (name: string) =>
    `w-full rounded-md border bg-white px-4 py-3 text-sm text-charcoal outline-none transition-colors placeholder:text-charcoal/40 focus:border-green ${
      errors[name] ? 'border-red-400' : 'border-hairline'
    }`

  return (
    <div>
      <SectionHeading
        eyebrow="Enquiry Form"
        title="Send Us Your Enquiry"
      />

      {status === 'success' ? (
        <div className="mt-8 rounded-2xl border border-green/40 bg-green/8 p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green text-white">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M5 13l4 4L19 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h3 className="mt-4 text-xl font-semibold text-navy">
            Thank you
          </h3>

          <p className="mt-2 text-charcoal/70">
            Your enquiry has been received and our team will be in touch.
          </p>

          <button
            type="button"
            onClick={() => setStatus('idle')}
            className="mt-5 text-sm font-semibold text-green hover:text-forest"
          >
            Send another enquiry →
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          onChange={handleFieldEdit}
          noValidate
          className="mt-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            {FORM_FIELDS.map((field) => {
              const fullWidth =
                field.name === 'name' ||
                field.name === 'requirement'

              return (
                <div
                  key={field.name}
                  className={fullWidth ? 'sm:col-span-2' : ''}
                >
                  <label
                    htmlFor={field.name}
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-navy/70"
                  >
                    {field.label}

                    {field.required && (
                      <span className="text-green"> *</span>
                    )}
                  </label>

                  {/* Country */}
                  {field.name === 'country' && (
                    <select
                      id={field.name}
                      name={field.name}
                      defaultValue=""
                      aria-invalid={
                        errors[field.name] ? true : undefined
                      }
                      className={inputCls(field.name)}
                    >
                      <option value="" disabled>
                        {field.placeholder}
                      </option>

                      {FORM_COUNTRIES.map((country) => (
                        <option
                          key={country}
                          value={country}
                        >
                          {country}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* Area of Interest */}
                  {field.name === 'area' && (
                    <select
                      id={field.name}
                      name={field.name}
                      defaultValue=""
                      aria-invalid={
                        errors[field.name] ? true : undefined
                      }
                      className={inputCls(field.name)}
                    >
                      <option value="">
                        {field.placeholder}
                      </option>

                      {AREA_OF_INTEREST.map((area) => (
                        <option
                          key={area}
                          value={area}
                        >
                          {area}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* Requirement */}
                  {field.name === 'requirement' && (
                    <textarea
                      id={field.name}
                      name={field.name}
                      rows={5}
                      placeholder={field.placeholder}
                      aria-invalid={
                        errors[field.name] ? true : undefined
                      }
                      className={inputCls(field.name)}
                    />
                  )}

                  {/* Normal inputs */}
                  {field.name !== 'country' &&
                    field.name !== 'area' &&
                    field.name !== 'requirement' && (
                      <input
                        id={field.name}
                        name={field.name}
                        type={field.type}
                        placeholder={field.placeholder}
                        aria-invalid={
                          errors[field.name]
                            ? true
                            : undefined
                        }
                        className={inputCls(field.name)}
                      />
                    )}
                </div>
              )
            })}
          </div>

          {status === 'error' && (
            <p className="mt-5 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-600">
              Please check the highlighted fields and make sure
              all required information is valid.
            </p>
          )}

          <button
            type="submit"
            className="group mt-6 inline-flex items-center gap-2 rounded-md bg-navy px-7 py-4 text-base font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-green"
          >
            Send Enquiry

            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 8h9M8 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </form>
      )}
    </div>
  )
}