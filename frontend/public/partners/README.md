# Partner / recognition logos

The footer "Backed & supported by" wall (`src/components/Footer.jsx` → `PARTNERS`)
loads the logo images from this folder. Add the following files here with these
exact names (PNG, ideally transparent or white background, roughly 240–320px wide):

| File                        | Organisation                                                        | Links to                     |
|-----------------------------|---------------------------------------------------------------------|------------------------------|
| `../dpiit.png` (repo root)  | DPIIT — Startup India (already present in `public/`)                | https://www.startupindia.gov.in |
| `niti-aayog.png`            | NITI Aayog                                                          | https://www.niti.gov.in      |
| `csir.png`                  | CSIR — Council of Scientific & Industrial Research                  | https://www.csir.res.in      |
| `msme.png`                  | MSME — Micro, Small & Medium Enterprises                           | https://msme.gov.in          |
| `aic-techno.png`            | AIC Techno — Atal Incubation Centre                                 | https://www.aic-techno.com   |
| `gnipst.png`                | GNIPST — Guru Nanak Institute of Pharmaceutical Science & Technology | https://www.gnipst.ac.in      |
| `ciptahs.png`               | Calcutta Institute of Pharmaceutical Technology & Allied Health Sciences | https://www.ciptulb.in   |
| `bangla-hunt.png`           | Bangla Hunt                                                        | https://banglahunt.in        |

Each logo is displayed inside a white rounded "chip" (fixed 132×76 box,
`object-fit: contain`) so the different logo backgrounds read as one consistent
badge wall in both light and dark themes. To add or change a logo, edit the
`PARTNERS` array in `Footer.jsx`.
