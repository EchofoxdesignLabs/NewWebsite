import React, { useState } from "react";
import styles from "./styles/ContactSection.module.css";
import CurvedCTA from "../../../UI/CTA/CurvedCTA";

export default function ContactSection() {
  const [sending, setSending] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);

    // TODO: wire to your API / Netlify Forms / Formspree
    // Temporary UX:
    setTimeout(() => {
      alert("Thanks! We’ll get back to you soon.");
      setSending(false);
      e.currentTarget.reset();
    }, 800);
  };

  return (
    <section className={styles.section} aria-label="Contact">
      <div className={styles.inner}>
        <p className={styles.kicker}>
          <span className={styles.dot} /> contact
        </p>

        <h2 className={styles.title}>Dreaming of<br/>something cool?</h2>

        <form className={styles.form} onSubmit={onSubmit}>
          <div className={styles.row}>
            <label className={styles.field}>
              <span className={styles.label}>Name</span>
              <input className={styles.input} type="text" name="name" required />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Email</span>
              <input className={styles.input} type="email" name="email" required />
            </label>
          </div>

          <div className={styles.row}>
            <label className={styles.field}>
              <span className={styles.label}>Phone Number</span>
              <input className={styles.input} type="tel" name="phone" />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Company Name</span>
              <input className={styles.input} type="text" name="company" />
            </label>
          </div>

          <label className={styles.field}>
            <span className={styles.label}>Tell us more about your project</span>
            <textarea className={styles.textarea} name="message" rows="3" />
          </label>

          <div className={styles.submitRow}>
            <CurvedCTA as="button" type="submit" className={styles.ctaLarge}>
            send message
            </CurvedCTA>
          </div>
        </form>
      </div>
    </section>
  );
}
