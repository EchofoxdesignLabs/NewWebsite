// src/components/UI.jsx

import './UI.css';

export function UI() {
  return (
    <div className="ui-container">
      <header className="header">
        <div className="logo">ECHOFOX</div>
        <nav>
          <a href="#">WORK</a>
          <a href="#">ABOUT</a>
          <a href="#">CAREER</a>
          <a href="#">CONTACT</a>
        </nav>
      </header>
      <main className="main-content">
        <h1>
          Research. Design.
          <br />
          Development<span className="red-dot">.</span>
        </h1>
      </main>
      <footer className="footer-content">
        <p>Innovation through extensive research, boundless originality, attention to detail & industry leading quality.</p>
      </footer>
    </div>
  );
}