# Heritage Alloys website (draft)

A plain HTML, CSS and JavaScript site. No build step, no frameworks, no external services except the optional contact form and the Google Map. Fonts and icons are included in the folder, so the site loads fast and does not depend on Google Fonts. It follows the visitor's light or dark device setting.

**Everything in this draft is sample content.** The business name, years, address, phone number, products and photos are all placeholders. Search the project for `TODO` to find every place that needs your real information. The photos are grey placeholders: the site needs real photos for the home page, the story page and six gallery slots.

## Put it online with GitHub Pages

1. Create a new **public** repository on GitHub (for example `heritage-alloys`). A family-owned GitHub account or organisation is best, so the family controls the site long-term.
2. Upload all files in this folder to the repository. `index.html` must be at the top level.
3. Go to **Settings > Pages**. Under "Build and deployment", choose **Deploy from a branch**, pick `main` and `/ (root)`, then save.
4. After a minute or two the site is live at `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`.

All links in the site are relative, so it works at that address and will keep working when you add a custom domain.

## What to edit first

| What | Where |
|---|---|
| Business name | Search all `.html` files for `Heritage Alloys` and replace it |
| Phone number | Search for `+91 00000 00000` and `+910000000000` |
| Email | Search for `info@yourdomain.in` |
| Address and hours | `index.html`, `contact.html` and the footer of each page |
| History and timeline | `about.html` |
| Alloy list | `products.html` (and the short list on `index.html`) |
| Opening hours | Text on `index.html` and `contact.html`. The live "Open now" label reads the `data-open`, `data-close` and `data-days` values (days are 0 = Sunday to 6 = Saturday), so change those too |
| Colours and fonts | The top of `css/style.css` (one accent colour, in `--accent`) |
| Menu, footer, phone number | Repeated in each `.html` file, so change them in all five |

## Photos

The `.svg` files in `images/` are placeholders. To use real photos:

1. Resize each photo to about 1600 pixels wide (JPG, under 400 KB if you can).
2. Put it in `images/`.
3. In the HTML, change the file name in `src="images/photo-1.svg"` to your file, for example `src="images/workshop.jpg"`. In `gallery.html` also change the matching `data-full` value.
4. Update the `alt` text so it describes the photo. This helps visitors who use screen readers, and search engines.

## Contact form

GitHub Pages cannot receive form submissions by itself, so the form uses the free service Formspree.

1. Sign up at formspree.io and create a new form. Use the family's email address.
2. Formspree gives you a form ID. In `contact.html`, replace `YOUR_FORM_ID` in the form's `action` with it.
3. Send a test enquiry. Formspree may ask you to confirm the email address the first time.

Until this is done, the form shows a message asking visitors to call or use WhatsApp.

## Google Map

1. Open Google Maps and search for the business.
2. Choose **Share**, then **Embed a map**, and copy the link.
3. In `contact.html`, replace the `src` of the `<iframe class="map">` with the one from the copied code.

Also create a free **Google Business Profile** for the business. For a local business it usually matters as much as the website.

## Adding a page

1. Copy `about.html` to a new file, for example `services.html`.
2. Change the title, description, heading and content.
3. Add a link to it in the `<nav>` of every page and in the footer.

## Custom domain (later)

1. Buy the domain from any registrar.
2. In the repository, go to **Settings > Pages**, enter the domain under "Custom domain" and save. This creates a `CNAME` file.
3. At the registrar, add the DNS records GitHub lists in its documentation for custom domains (A records for the main domain, and a CNAME record for `www` pointing to `YOUR-USERNAME.github.io`).
4. Wait for DNS to update, which can take up to 24 hours, then tick **Enforce HTTPS**.
