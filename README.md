# Zane & Zora — Legal Practitioners Website

A modern, professional law firm website built for Zane & Zora, modeled on the
structure of leading full-service firm sites (firm overview, practice areas,
people, insights, contact) and themed entirely off the firm's own logo.

## What's included

- **Pages:** Home, The Firm (About), Practice Areas, Our People, Insights,
  Contact.
- **Design:** a custom visual identity built from the firm's actual mark —
  brushed gold (`#A6895F`), charcoal ink (`#211F1B`), and silver-grey accents
  — paired with a classical serif (Cormorant Garamond) for headings and a
  clean sans (Inter) for body text.
- **Logo:** the uploaded mark is used as-is (already transparent). A cropped
  icon-only version (`images/zane-zora-icon.png`) is used in the navigation
  and footer for a compact lockup; the full icon+wordmark version
  (`images/zane-zora-logo.png`) is available if you want it elsewhere.
- **Photography:** licensed, free-to-use stock photography from Unsplash
  (boardroom, skyline, justice statue, law books, handshake), hotlinked
  directly from Unsplash's CDN — no attribution required under the
  Unsplash License, but crediting photographers is good practice if you'd
  like to.
- **Contact form:** a working front-end form that confirms submission in
  the browser. It does not currently send anywhere — see "Wiring up the
  contact form" below before launch.

## Running it

This is a fully static site — no build step, no server, no dependencies.

1. Unzip the project.
2. Open `index.html` directly in your browser, **or** for the most
   reliable experience (and to avoid any browser restrictions on local
   file access), serve it with a simple local server:

   ```bash
   cd zane-zora
   python3 -m http.server 8000
   ```

   Then open **http://localhost:8000**.

## Wiring up the contact form

Right now, submitting the contact form just shows a confirmation message —
it doesn't send an email anywhere. Before launch, connect it to one of:

- A form backend service (Formspree, Getform, Basin) — usually just a change
  to the form's `action` attribute, no server required.
- Your own backend endpoint, if you have one.
- An email service like SendGrid or Nodemailer, if you add a small server.

## Editing content

- All page text lives directly in the `.html` files — search for the text
  you want to change.
- Colors, fonts, and spacing are defined once in `css/style.css` under
  `:root` at the top of the file.
- Team members are listed in `people.html` inside `.team-grid` blocks —
  update names, roles, and initials there.
- Practice area copy lives in both `index.html` (short previews) and
  `practice-areas.html` (full descriptions).

## Folder structure

```
zane-zora/
├── index.html
├── about.html
├── practice-areas.html
├── people.html
├── insights.html
├── contact.html
├── css/style.css
├── js/main.js
└── images/
    ├── zane-zora-icon.png     (cropped icon mark, used in nav/footer)
    ├── zane-zora-logo.png     (full icon + wordmark lockup)
    └── zane-zora-logo-full.png (original upload, untouched)
```
