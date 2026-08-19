import { useState } from 'react';
import { ArrowRight, EnvelopeSimple, MapPin, Phone } from '@phosphor-icons/react';
import { contact } from '../content/site';

type Status = 'idle' | 'sent';
type Errors = Partial<Record<'name' | 'email' | 'message', string>>;

/**
 * The end of the journey.
 *
 * Every contact route on this page resolves to info@flitetransport.com: the address link, the
 * form, and the fallback offered if anything goes wrong.
 *
 * The form hands off to the visitor's mail client with the message prefilled and addressed to
 * that inbox. That is a deliberate choice for a static site with no backend: a form that POSTs
 * somewhere unconfigured looks like it worked and silently drops the enquiry, which is the worst
 * possible failure for the one page element whose entire job is generating leads. This way the
 * mail is visibly in the visitor's own outbox.
 *
 * Field names stay `name`, `email` and `message`, matching the existing site, so swapping in a
 * real endpoint later is a one-function change.
 */
function validate(data: { name: string; email: string; message: string }): Errors {
  const errors: Errors = {};
  if (!data.name.trim()) errors.name = 'Please enter your name.';
  if (!data.email.trim()) {
    errors.email = 'Please enter your email address.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = 'That email address does not look right.';
  }
  if (!data.message.trim()) errors.message = 'Please tell us what you need.';
  return errors;
}

export function Contact() {
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Errors>({});

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const values = {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
    };

    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      // Move the user to the first thing that needs fixing rather than just reddening the field.
      form.querySelector<HTMLElement>(`[name="${Object.keys(found)[0]}"]`)?.focus();
      return;
    }

    const subject = `Website enquiry from ${values.name}`;
    const body = `${values.message}\n\n---\nName: ${values.name}\nEmail: ${values.email}`;
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    setStatus('sent');
    form.reset();
  }

  return (
    <section className="contact" id="contact" aria-labelledby="contact-heading">
      <div className="contact__inner shell">
        <div className="contact__detail">
          <h2 id="contact-heading" className="reveal">
            Let&rsquo;s talk about your last mile
          </h2>

          <ul className="contact__list reveal">
            <li>
              <MapPin size={18} weight="bold" aria-hidden="true" />
              <span>
                {contact.street}, {contact.unit}
                <br />
                {contact.city}, {contact.region} {contact.postal}
              </span>
            </li>
            <li>
              <Phone size={18} weight="bold" aria-hidden="true" />
              <a href={contact.phoneHref}>{contact.phone}</a>
            </li>
            <li>
              <EnvelopeSimple size={18} weight="bold" aria-hidden="true" />
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </li>
          </ul>
        </div>

        <form className="form reveal" onSubmit={onSubmit} noValidate>
          <div className="field">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" type="text" autoComplete="name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} />
            {errors.name && (
              <p className="field__error" id="name-error">
                {errors.name}
              </p>
            )}
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} />
            {errors.email && (
              <p className="field__error" id="email-error">
                {errors.email}
              </p>
            )}
          </div>

          <div className="field">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows={5} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'message-error' : undefined} />
            {errors.message && (
              <p className="field__error" id="message-error">
                {errors.message}
              </p>
            )}
          </div>

          <button className="btn" type="submit">
            Send
            <ArrowRight size={15} weight="bold" />
          </button>

          <p className="form__status" role="status">
            {status === 'sent'
              ? `Your email client should have opened, addressed to ${contact.email}. If it did not, write to us there directly.`
              : `Goes straight to ${contact.email}.`}
          </p>
        </form>
      </div>
    </section>
  );
}
