// =====================================================
// DOCTAR Surgery Website — Data Layer
// All categories, treatments, doctors, testimonials
// =====================================================

const SITE_CONFIG = {
  name: 'DOCTAR',
  tagline: 'Surgery Care, Simplified.',
  phone: '+91-8877772277',
  email: 'care@doctar.in',
  address: '4th Floor, Tower B, DLF Cyber City, Gurugram, Haryana 122002',
  city: 'India',
};

// =====================================================
// CATEGORIES (12)
// =====================================================
const CATEGORIES = [
  {
    id: 1,
    name: 'Proctology',
    slug: 'proctology',
    icon: '🩺',
    color: '#8B4513',
    colorLight: '#f5ebe0',
    treatmentCount: 5,
    tags: ['Piles', 'Fissure', 'Fistula'],
    description: 'Specialised & advanced treatment for Anorectal Diseases using laser techniques for quick recovery, minimal pain, and low complication risk.',
    image: 'images/cat-proctology.png',
  },
  {
    id: 2,
    name: 'Laparoscopy',
    slug: 'laparoscopy',
    icon: '🔬',
    color: '#2563eb',
    colorLight: '#dbeafe',
    treatmentCount: 5,
    tags: ['Hernia', 'Gallbladder', 'Appendix'],
    description: 'Keyhole surgery for abdominal and pelvic disorders.',
    image: 'images/cat-laparoscopy.png',
  },
  {
    id: 3,
    name: 'Gynaecology',
    slug: 'gynaecology',
    icon: '♀️',
    color: '#16a34a',
    colorLight: '#dcfce7',
    treatmentCount: 17,
    tags: ['Fibroid', 'PCOS', 'Hysterectomy'],
    description: 'Treatment of diseases related to female reproductive organs including surgical, cosmetic, and fertility-related procedures.',
    image: 'images/cat-gynaecology.png',
  },
  {
    id: 4,
    name: 'ENT (Ear, Nose, Throat)',
    slug: 'ent',
    icon: '👂',
    color: '#ea580c',
    colorLight: '#ffedd5',
    treatmentCount: 15,
    tags: ['Sinus', 'Tonsils', 'Septoplasty'],
    description: 'Minimal access surgery for ear, nose and throat issues using the latest diagnostic and surgical technology.',
    image: 'images/cat-ent.png',
  },
  {
    id: 5,
    name: 'Urology',
    slug: 'urology',
    icon: '🫘',
    color: '#ca8a04',
    colorLight: '#fef9c3',
    treatmentCount: 23,
    tags: ['Kidney Stone', 'Prostate', 'Circumcision'],
    description: 'Surgical treatment for urogenital issues in men and women, including kidney stones, prostate, and penile health conditions.',
    image: 'images/cat-urology.png',
  },
  {
    id: 6,
    name: 'Vascular',
    slug: 'vascular',
    icon: '🫀',
    color: '#dc2626',
    colorLight: '#fee2e2',
    treatmentCount: 6,
    tags: ['Varicose Veins', 'DVT', 'AV Fistula'],
    description: 'Surgical subspecialty focusing on the vascular system — arteries, veins and lymphatic circulation.',
    image: 'images/cat-vascular.png',
  },
  {
    id: 7,
    name: 'Aesthetics',
    slug: 'aesthetics',
    icon: '✨',
    color: '#7c3aed',
    colorLight: '#ede9fe',
    treatmentCount: 19,
    tags: ['Hair Transplant', 'Rhinoplasty', 'Liposuction'],
    description: 'Reconstruction or improvement of physical appearance using advanced and safe surgical methods.',
    image: 'images/cat-aesthetics.png',
  },
  {
    id: 8,
    name: 'Orthopedics (Bone & Joint)',
    slug: 'orthopedics',
    icon: '🦴',
    color: '#0891b2',
    colorLight: '#cffafe',
    treatmentCount: 13,
    tags: ['Knee', 'Hip', 'Spine'],
    description: 'Focuses on injuries and diseases of the musculoskeletal system using minimally invasive and arthroscopic techniques.',
    image: 'images/cat-orthopedics.png',
  },
  {
    id: 9,
    name: 'Ophthalmology',
    slug: 'ophthalmology',
    icon: '👁️',
    color: '#6d28d9',
    colorLight: '#f3e8ff',
    treatmentCount: 13,
    tags: ['Cataract', 'LASIK', 'Retina'],
    description: 'Diagnosis and treatment of conditions related to the eyes including cataract, refractive errors, and retinal conditions.',
    image: 'images/cat-ophthalmology.png',
  },
  {
    id: 10,
    name: 'Fertility',
    slug: 'fertility',
    icon: '🤱',
    color: '#9f1239',
    colorLight: '#ffe4e6',
    treatmentCount: 6,
    tags: ['IVF', 'IUI', 'Egg Freezing'],
    description: 'Comprehensive treatment of health issues related to male and female infertility with personalised protocols.',
    image: 'images/cat-fertility.png',
  },
  {
    id: 11,
    name: 'Weight Loss',
    slug: 'weight-loss',
    icon: '⚖️',
    color: '#65a30d',
    colorLight: '#ecfccb',
    treatmentCount: 3,
    tags: ['Bariatric', 'Gastric Balloon', 'Liposuction'],
    description: 'Advanced and scientifically proven bariatric surgery and gastric balloon treatment for sustainable weight loss.',
    image: 'images/cat-weightloss.png',
  },
  {
    id: 12,
    name: 'Dermatology',
    slug: 'dermatology',
    icon: '🧴',
    color: '#e11d48',
    colorLight: '#fce7f3',
    treatmentCount: 7,
    tags: ['Acne Scars', 'Laser', 'PRP'],
    description: 'Treating skin conditions and enhancing natural beauty using clinically proven non-surgical and minimally invasive procedures.',
    image: 'images/cat-dermatology.png',
  },
];

// =====================================================
// TREATMENTS (keyed by category slug)
// =====================================================
const TREATMENTS = {
  proctology: [
    { name: 'Piles / Hemorrhoids Treatment', slug: 'piles-treatment', brief: 'Laser & stapler treatment for hemorrhoids with same-day discharge.', recovery: '2-3 days', costRange: '₹35,000 - ₹90,000', procedure: 'Minimally invasive laser hemorrhoidoplasty or stapled hemorrhoidopexy performed under local/spinal anesthesia. The laser precisely shrinks hemorrhoidal tissue with minimal bleeding.', benefits: ['Painless laser procedure', 'Same-day discharge', '30-min procedure time', 'No cuts or stitches', 'Quick return to work'] },
    { name: 'Anal Fissure Treatment', slug: 'anal-fissure', brief: 'Laser treatment for chronic anal fissures with minimal pain.', recovery: '3-5 days', costRange: '₹35,000 - ₹75,000', procedure: 'Lateral internal sphincterotomy (LIS) using laser technology to relax the internal sphincter muscle and promote healing of the fissure.', benefits: ['Painless laser surgery', 'Quick healing', 'No recurrence risk', 'Daycare procedure', 'Minimal downtime'] },
    { name: 'Anal Fistula Treatment', slug: 'anal-fistula', brief: 'Advanced laser treatment for complex fistulas.', recovery: '5-7 days', costRange: '₹40,000 - ₹1,00,000', procedure: 'FiLaC (Fistula Laser Closure) or VAAFT (Video-Assisted Anal Fistula Treatment) for precise closure of fistula tracts without damaging sphincter muscles.', benefits: ['Sphincter-preserving technique', 'Low recurrence rate', 'Minimal post-op pain', 'Quick recovery', 'No incontinence risk'] },
    { name: 'Pilonidal Sinus Surgery', slug: 'pilonidal-sinus', brief: 'Laser excision of pilonidal sinus cysts near tailbone.', recovery: '7-10 days', costRange: '₹35,000 - ₹80,000', procedure: 'Laser-assisted excision and closure of the sinus tract. The laser seals blood vessels and nerve endings, reducing pain and speeding recovery.', benefits: ['Minimal scarring', 'Low recurrence', 'Quick procedure', 'Less bleeding', 'Early mobility'] },
    { name: 'Rectal Prolapse Treatment', slug: 'rectal-prolapse', brief: 'Surgical correction of rectal prolapse.', recovery: '10-14 days', costRange: '₹50,000 - ₹1,50,000', procedure: 'Laparoscopic rectopexy to anchor the rectum in its correct position. Minimally invasive approach with small incisions.', benefits: ['Laparoscopic approach', 'Permanent correction', 'Minimal scarring', 'Faster recovery', 'Expert surgical team'] },
  ],
  laparoscopy: [
    { name: 'Laparoscopic Cholecystectomy', slug: 'gallbladder-removal', brief: 'Keyhole gallbladder removal for gallstones.', recovery: '3-5 days', costRange: '₹45,000 - ₹1,00,000', procedure: 'Removal of the gallbladder through 3-4 small keyhole incisions using a laparoscope and specialized instruments.', benefits: ['Tiny incisions (5-10mm)', 'Same-day or next-day discharge', 'Minimal scarring', 'Quick return to normal diet', 'Very low complication rate'] },
    { name: 'Laparoscopic Hernia Repair', slug: 'hernia-repair-lap', brief: 'Minimally invasive hernia mesh repair.', recovery: '5-7 days', costRange: '₹50,000 - ₹1,20,000', procedure: 'TEP or TAPP hernia repair using laparoscopic mesh placement to reinforce the weakened abdominal wall through small incisions.', benefits: ['Less post-operative pain', 'Faster recovery', 'Lower recurrence rate', 'Bilateral repair possible', 'Early return to activity'] },
    { name: 'Laparoscopic Appendectomy', slug: 'appendix-removal', brief: 'Keyhole removal of inflamed appendix.', recovery: '3-5 days', costRange: '₹40,000 - ₹90,000', procedure: 'Removal of the inflamed appendix through 3 small incisions using laparoscopic instruments and camera guidance.', benefits: ['Emergency availability', 'Small incisions', 'Quick recovery', 'Less infection risk', 'Same-day discharge possible'] },
    { name: 'Diagnostic Laparoscopy', slug: 'diagnostic-laparoscopy', brief: 'Minimally invasive internal examination.', recovery: '1-2 days', costRange: '₹30,000 - ₹60,000', procedure: 'Insertion of a laparoscope through a small incision to visually examine abdominal and pelvic organs for diagnosis.', benefits: ['Accurate diagnosis', 'Minimal invasion', 'Short hospital stay', 'Can treat during diagnosis', 'Low risk procedure'] },
    { name: 'Laparoscopic Myomectomy', slug: 'myomectomy', brief: 'Keyhole removal of uterine fibroids.', recovery: '7-10 days', costRange: '₹60,000 - ₹1,50,000', procedure: 'Removal of uterine fibroids through small laparoscopic incisions, preserving the uterus for future fertility.', benefits: ['Uterus preservation', 'Minimal blood loss', 'Faster healing', 'Less adhesion formation', 'Better cosmetic outcome'] },
  ],
  gynaecology: [
    { name: 'Hysterectomy', slug: 'hysterectomy', brief: 'Surgical removal of the uterus.', recovery: '4-6 weeks', costRange: '₹70,000 - ₹2,50,000', procedure: 'Laparoscopic or vaginal hysterectomy to remove the uterus, with options to preserve ovaries based on condition.', benefits: ['Minimally invasive options', 'Experienced gynecologists', 'Comprehensive pre-op counseling', 'Post-op rehabilitation', 'Insurance coverage'] },
    { name: 'Fibroid Removal', slug: 'fibroid-removal', brief: 'Surgical removal of uterine fibroids.', recovery: '2-4 weeks', costRange: '₹50,000 - ₹1,50,000', procedure: 'Laparoscopic or hysteroscopic myomectomy to remove fibroids while preserving the uterus.', benefits: ['Fertility preservation', 'Minimal scarring', 'Quick recovery', 'Advanced techniques', 'Expert surgeons'] },
    { name: 'Ovarian Cyst Removal', slug: 'ovarian-cyst', brief: 'Laparoscopic removal of ovarian cysts.', recovery: '1-2 weeks', costRange: '₹40,000 - ₹1,20,000', procedure: 'Laparoscopic cystectomy to carefully remove the cyst while preserving healthy ovarian tissue.', benefits: ['Ovary preservation', 'Keyhole surgery', 'Short hospital stay', 'Quick return to work', 'Low recurrence'] },
    { name: 'PCOS Treatment', slug: 'pcos-treatment', brief: 'Comprehensive PCOS management and surgery.', recovery: '3-5 days', costRange: '₹30,000 - ₹80,000', procedure: 'Laparoscopic ovarian drilling or medical management for polycystic ovary syndrome.', benefits: ['Improved fertility', 'Hormone regulation', 'Minimally invasive', 'Personalized approach', 'Long-term management'] },
    { name: 'Endometriosis Treatment', slug: 'endometriosis', brief: 'Surgical treatment for endometriosis.', recovery: '2-3 weeks', costRange: '₹50,000 - ₹1,50,000', procedure: 'Laparoscopic excision of endometrial implants and adhesions to reduce pain and improve fertility.', benefits: ['Pain relief', 'Fertility improvement', 'Expert laparoscopists', 'Complete excision', 'Comprehensive care'] },
    { name: 'D&C (Dilation & Curettage)', slug: 'dnc-procedure', brief: 'Uterine cleaning procedure.', recovery: '2-3 days', costRange: '₹15,000 - ₹40,000', procedure: 'Dilating the cervix and gently scraping the uterine lining for diagnostic or therapeutic purposes.', benefits: ['Quick procedure', 'Same-day discharge', 'Diagnostic clarity', 'Minimal discomfort', 'Safe procedure'] },
    { name: 'Bartholin Cyst Treatment', slug: 'bartholin-cyst', brief: 'Marsupialization or excision of Bartholin cysts.', recovery: '3-5 days', costRange: '₹20,000 - ₹50,000', procedure: 'Surgical drainage, marsupialization, or complete excision of Bartholin gland cysts under local or general anesthesia.', benefits: ['Quick relief', 'Low recurrence', 'Daycare procedure', 'Minimal pain', 'Expert care'] },
    { name: 'Vaginal Tightening', slug: 'vaginoplasty', brief: 'Vaginal rejuvenation surgery.', recovery: '4-6 weeks', costRange: '₹40,000 - ₹1,00,000', procedure: 'Laser-assisted or surgical vaginoplasty to tighten vaginal muscles and surrounding tissues.', benefits: ['Improved quality of life', 'Minimally invasive options', 'Quick recovery', 'Confidential care', 'Experienced surgeons'] },
    { name: 'Tubal Ligation', slug: 'tubal-ligation', brief: 'Permanent female sterilization.', recovery: '3-5 days', costRange: '₹20,000 - ₹50,000', procedure: 'Laparoscopic tubal ligation — fallopian tubes are cut, tied, or blocked to prevent pregnancy.', benefits: ['Permanent solution', 'Minimally invasive', 'Quick procedure', 'No hormonal changes', 'Same-day discharge'] },
    { name: 'Ectopic Pregnancy Surgery', slug: 'ectopic-pregnancy', brief: 'Emergency treatment for ectopic pregnancy.', recovery: '2-4 weeks', costRange: '₹40,000 - ₹1,00,000', procedure: 'Laparoscopic removal of ectopic pregnancy, with fallopian tube preservation when possible.', benefits: ['Emergency availability', 'Tube preservation', 'Expert surgeons', 'Minimally invasive', 'Comprehensive aftercare'] },
    { name: 'Uterine Polyp Removal', slug: 'uterine-polyp', brief: 'Hysteroscopic polyp removal.', recovery: '2-3 days', costRange: '₹25,000 - ₹60,000', procedure: 'Hysteroscopic polypectomy to remove polyps from the uterine lining using a thin camera-guided instrument.', benefits: ['No external incisions', 'Daycare procedure', 'Fertility improvement', 'Accurate removal', 'Quick recovery'] },
    { name: 'Adenomyosis Treatment', slug: 'adenomyosis', brief: 'Medical and surgical treatment for adenomyosis.', recovery: '2-6 weeks', costRange: '₹40,000 - ₹1,50,000', procedure: 'Hormonal therapy or surgical options including adenomyomectomy or hysterectomy based on severity.', benefits: ['Pain relief', 'Personalized treatment', 'Fertility options', 'Expert care', 'Follow-up support'] },
    { name: 'Pelvic Floor Repair', slug: 'pelvic-floor-repair', brief: 'Surgical correction of pelvic organ prolapse.', recovery: '4-6 weeks', costRange: '₹60,000 - ₹1,80,000', procedure: 'Surgical repair of weakened pelvic floor muscles and tissues to correct organ prolapse.', benefits: ['Improved quality of life', 'Expert pelvic surgeons', 'Minimally invasive options', 'Long-lasting results', 'Comprehensive rehab'] },
    { name: 'Menorrhagia Treatment', slug: 'menorrhagia', brief: 'Treatment for heavy menstrual bleeding.', recovery: '1-2 weeks', costRange: '₹30,000 - ₹80,000', procedure: 'Endometrial ablation, hormonal treatment, or hysteroscopic procedures to manage heavy bleeding.', benefits: ['Multiple treatment options', 'Quick procedure', 'Effective results', 'Minimal downtime', 'Expert gynecologists'] },
    { name: 'Cervical Biopsy', slug: 'cervical-biopsy', brief: 'Tissue sampling from the cervix for diagnosis.', recovery: '1-2 days', costRange: '₹10,000 - ₹25,000', procedure: 'Colposcopy-guided biopsy of cervical tissue for histopathological examination and early detection.', benefits: ['Early detection', 'Quick procedure', 'Minimal discomfort', 'Accurate diagnosis', 'Outpatient procedure'] },
    { name: 'Colposcopy', slug: 'colposcopy', brief: 'Detailed examination of the cervix.', recovery: '1 day', costRange: '₹5,000 - ₹15,000', procedure: 'Magnified examination of the cervix, vagina, and vulva using a colposcope for detecting abnormalities.', benefits: ['Non-invasive screening', 'Immediate results', 'Painless procedure', 'Early cancer detection', 'No hospital stay'] },
    { name: 'Cervical Cerclage', slug: 'cervical-cerclage', brief: 'Cervical stitch to prevent preterm birth.', recovery: '1-2 weeks', costRange: '₹25,000 - ₹60,000', procedure: 'Placement of a purse-string suture around the cervix to keep it closed during pregnancy.', benefits: ['Prevents preterm delivery', 'Safe for baby', 'Expert obstetricians', 'Monitoring included', 'High success rate'] },
  ],
  ent: [
    { name: 'Septoplasty', slug: 'septoplasty', brief: 'Correction of deviated nasal septum.', recovery: '1-2 weeks', costRange: '₹40,000 - ₹90,000', procedure: 'Endoscopic straightening of the nasal septum to improve breathing and reduce sinus issues.', benefits: ['Improved breathing', 'Endoscopic technique', 'No external scarring', 'Quick recovery', 'Better sleep quality'] },
    { name: 'Tonsillectomy', slug: 'tonsillectomy', brief: 'Surgical removal of tonsils.', recovery: '1-2 weeks', costRange: '₹30,000 - ₹70,000', procedure: 'Removal of inflamed or infected tonsils using coblation or laser technology for minimal bleeding.', benefits: ['Fewer throat infections', 'Better breathing', 'Improved sleep', 'Quick procedure', 'Daycare surgery'] },
    { name: 'Adenoidectomy', slug: 'adenoidectomy', brief: 'Removal of enlarged adenoids.', recovery: '1 week', costRange: '₹25,000 - ₹60,000', procedure: 'Endoscopic removal of enlarged adenoid tissue blocking the nasal passage, commonly performed in children.', benefits: ['Better nasal breathing', 'Reduced infections', 'Improved hearing', 'Child-safe procedure', 'Quick recovery'] },
    { name: 'Sinus Surgery (FESS)', slug: 'sinus-surgery', brief: 'Functional endoscopic sinus surgery.', recovery: '1-2 weeks', costRange: '₹45,000 - ₹1,20,000', procedure: 'Endoscopic surgery to open blocked sinuses, remove polyps, and improve drainage using tiny cameras and instruments.', benefits: ['No external incisions', 'Precise removal', 'Improved breathing', 'Reduced infections', 'Quick relief'] },
    { name: 'Ear Drum Repair (Tympanoplasty)', slug: 'tympanoplasty', brief: 'Surgical repair of perforated eardrum.', recovery: '2-3 weeks', costRange: '₹40,000 - ₹1,00,000', procedure: 'Microsurgical repair of the tympanic membrane using tissue grafts to restore hearing.', benefits: ['Hearing restoration', 'Microsurgical precision', 'High success rate', 'Prevents infections', 'Minimally invasive'] },
    { name: 'Thyroid Surgery', slug: 'thyroid-surgery', brief: 'Partial or total thyroidectomy.', recovery: '2-3 weeks', costRange: '₹60,000 - ₹1,80,000', procedure: 'Surgical removal of part or all of the thyroid gland for nodules, goiter, or thyroid cancer.', benefits: ['Expert endocrine surgeons', 'Nerve monitoring', 'Minimal scarring', 'Short hospital stay', 'Comprehensive follow-up'] },
    { name: 'Mastoidectomy', slug: 'mastoidectomy', brief: 'Removal of infected mastoid bone.', recovery: '3-4 weeks', costRange: '₹50,000 - ₹1,20,000', procedure: 'Surgical removal of infected or damaged mastoid bone cells behind the ear to treat chronic ear infections.', benefits: ['Infection clearance', 'Hearing preservation', 'Expert microsurgery', 'Prevents complications', 'Long-term relief'] },
    { name: 'Stapedectomy', slug: 'stapedectomy', brief: 'Treatment for otosclerosis-related hearing loss.', recovery: '2-3 weeks', costRange: '₹50,000 - ₹1,20,000', procedure: 'Microsurgical replacement of the stapes bone in the middle ear with a prosthesis to restore hearing.', benefits: ['Hearing improvement', 'Micro-precision surgery', 'High success rate', 'Quick procedure', 'Expert otologists'] },
    { name: 'Turbinate Reduction', slug: 'turbinate-reduction', brief: 'Reduction of enlarged nasal turbinates.', recovery: '1 week', costRange: '₹25,000 - ₹60,000', procedure: 'Radiofrequency or coblation reduction of enlarged inferior turbinates to improve nasal airflow.', benefits: ['Better breathing', 'Minimal pain', 'Quick procedure', 'No packing needed', 'Outpatient surgery'] },
    { name: 'Vocal Cord Surgery', slug: 'vocal-cord-surgery', brief: 'Treatment for vocal cord nodules and polyps.', recovery: '2-4 weeks', costRange: '₹40,000 - ₹1,00,000', procedure: 'Microlaryngoscopic surgery to remove polyps, nodules, or cysts from the vocal cords.', benefits: ['Voice restoration', 'Microsurgical precision', 'No external incisions', 'Speech therapy included', 'Expert ENT team'] },
    { name: 'Snoring Treatment (UPPP)', slug: 'snoring-treatment', brief: 'Surgical treatment for obstructive snoring.', recovery: '2-3 weeks', costRange: '₹40,000 - ₹1,00,000', procedure: 'Uvulopalatopharyngoplasty or laser-assisted procedures to reduce tissue obstructing the airway during sleep.', benefits: ['Better sleep quality', 'Reduced sleep apnea', 'Multiple techniques', 'Improved oxygen levels', 'Expert evaluation'] },
    { name: 'Ear Tube Insertion', slug: 'ear-tubes', brief: 'Myringotomy with tube placement.', recovery: '1-2 days', costRange: '₹15,000 - ₹40,000', procedure: 'Small tubes placed in the eardrum to drain fluid and equalize pressure, commonly for children with ear infections.', benefits: ['Immediate relief', 'Quick procedure', 'Reduced infections', 'Improved hearing', 'Child-friendly care'] },
    { name: 'Nasal Polyp Removal', slug: 'nasal-polyp', brief: 'Endoscopic removal of nasal polyps.', recovery: '1-2 weeks', costRange: '₹35,000 - ₹80,000', procedure: 'Endoscopic polypectomy to remove polyps from the nasal cavity and sinuses for improved breathing.', benefits: ['Improved breathing', 'Better sense of smell', 'Endoscopic precision', 'Reduced recurrence', 'Quick recovery'] },
    { name: 'Cochlear Implant', slug: 'cochlear-implant', brief: 'Electronic hearing device implantation.', recovery: '4-6 weeks', costRange: '₹5,00,000 - ₹12,00,000', procedure: 'Surgical implantation of an electronic device that provides a sense of sound to severely deaf patients.', benefits: ['Hearing restoration', 'Advanced technology', 'Life-changing results', 'Expert audiologists', 'Comprehensive rehab'] },
    { name: 'Laryngoscopy', slug: 'laryngoscopy', brief: 'Examination and treatment of the larynx.', recovery: '1-2 days', costRange: '₹10,000 - ₹30,000', procedure: 'Direct or indirect visualization of the larynx for diagnosis and minor procedures on the voice box.', benefits: ['Accurate diagnosis', 'Quick procedure', 'Minimal discomfort', 'Outpatient procedure', 'Biopsy possible'] },
  ],
  urology: [
    { name: 'Kidney Stone Treatment (RIRS/PCNL)', slug: 'kidney-stone', brief: 'Laser treatment for kidney & ureteral stones.', recovery: '2-5 days', costRange: '₹40,000 - ₹1,50,000', procedure: 'Retrograde Intrarenal Surgery (RIRS) or Percutaneous Nephrolithotomy (PCNL) using laser to fragment and remove stones.', benefits: ['No external cuts (RIRS)', 'Laser precision', 'Treats large stones', 'Short hospital stay', 'High clearance rate'] },
    { name: 'Prostate Surgery (TURP)', slug: 'prostate-surgery', brief: 'Transurethral resection for enlarged prostate.', recovery: '1-2 weeks', costRange: '₹50,000 - ₹1,50,000', procedure: 'Endoscopic removal of excess prostate tissue blocking urine flow, using bipolar or laser technology.', benefits: ['No external incision', 'Improved urine flow', 'Quick relief', 'Short hospital stay', 'Advanced techniques'] },
    { name: 'Circumcision', slug: 'circumcision', brief: 'Surgical removal of foreskin.', recovery: '5-7 days', costRange: '₹15,000 - ₹35,000', procedure: 'Stapler or laser circumcision for phimosis, paraphimosis, or personal preference with minimal bleeding.', benefits: ['Painless stapler method', 'Quick procedure', 'Minimal bleeding', 'Fast healing', 'Daycare surgery'] },
    { name: 'Varicocele Treatment', slug: 'varicocele', brief: 'Treatment for enlarged scrotal veins.', recovery: '1-2 weeks', costRange: '₹35,000 - ₹80,000', procedure: 'Microsurgical or laparoscopic varicocelectomy to ligate enlarged veins and improve blood flow.', benefits: ['Improved fertility', 'Pain relief', 'Microsurgical precision', 'Low recurrence', 'Quick recovery'] },
    { name: 'Hydrocele Treatment', slug: 'hydrocele', brief: 'Surgical treatment for scrotal fluid accumulation.', recovery: '1-2 weeks', costRange: '₹25,000 - ₹60,000', procedure: 'Hydrocelectomy — surgical drainage and repair of the tunica vaginalis to prevent fluid re-accumulation.', benefits: ['Permanent solution', 'Quick procedure', 'Minimal pain', 'Low recurrence', 'Expert urologists'] },
    { name: 'Urethral Stricture Treatment', slug: 'urethral-stricture', brief: 'Repair of narrowed urethra.', recovery: '2-4 weeks', costRange: '₹40,000 - ₹1,20,000', procedure: 'Urethrotomy or urethroplasty to widen or reconstruct the narrowed section of the urethra.', benefits: ['Improved urine flow', 'Multiple techniques', 'Expert reconstruction', 'Long-term results', 'Comprehensive care'] },
    { name: 'Cystoscopy', slug: 'cystoscopy', brief: 'Bladder examination and treatment.', recovery: '1-2 days', costRange: '₹15,000 - ₹40,000', procedure: 'Insertion of a thin scope through the urethra to examine the bladder and perform minor treatments.', benefits: ['Accurate diagnosis', 'Quick procedure', 'Outpatient', 'Can treat during diagnosis', 'Minimal discomfort'] },
    { name: 'Vasectomy', slug: 'vasectomy', brief: 'Male permanent contraception.', recovery: '3-5 days', costRange: '₹10,000 - ₹25,000', procedure: 'No-scalpel vasectomy — small puncture to access and seal the vas deferens, blocking sperm passage.', benefits: ['No-scalpel technique', 'Quick procedure', 'Highly effective', 'Minimal recovery', 'Outpatient procedure'] },
    { name: 'Urinary Incontinence Treatment', slug: 'urinary-incontinence', brief: 'Surgical correction for urine leakage.', recovery: '2-4 weeks', costRange: '₹40,000 - ₹1,20,000', procedure: 'Mid-urethral sling, colposuspension, or injectable bulking agents to restore urinary control.', benefits: ['Improved quality of life', 'Multiple options', 'Minimally invasive', 'High success rate', 'Expert care'] },
    { name: 'Bladder Stone Removal', slug: 'bladder-stone', brief: 'Endoscopic removal of bladder stones.', recovery: '2-3 days', costRange: '₹25,000 - ₹60,000', procedure: 'Cystolitholapaxy — endoscopic fragmentation and removal of bladder stones using laser or pneumatic energy.', benefits: ['No external cuts', 'Quick procedure', 'Complete clearance', 'Short hospital stay', 'Immediate relief'] },
    { name: 'Nephrectomy', slug: 'nephrectomy', brief: 'Surgical removal of kidney.', recovery: '4-6 weeks', costRange: '₹80,000 - ₹2,50,000', procedure: 'Laparoscopic or open nephrectomy for removal of a diseased or damaged kidney.', benefits: ['Laparoscopic option', 'Expert surgeons', 'Comprehensive care', 'Quick mobilization', 'Follow-up support'] },
    { name: 'URS (Ureteroscopy)', slug: 'ureteroscopy', brief: 'Stone removal from ureter.', recovery: '2-3 days', costRange: '₹35,000 - ₹80,000', procedure: 'Flexible or rigid ureteroscope passed through urethra to locate and laser-fragment ureteral stones.', benefits: ['No incisions', 'High success rate', 'Same-day discharge', 'Laser precision', 'Quick return to work'] },
    { name: 'Orchidopexy', slug: 'orchidopexy', brief: 'Surgical correction for undescended testicle.', recovery: '1-2 weeks', costRange: '₹30,000 - ₹70,000', procedure: 'Laparoscopic or open surgery to move an undescended testicle into the scrotum and fix it in place.', benefits: ['Early intervention', 'Fertility preservation', 'Cancer risk reduction', 'Cosmetic improvement', 'Expert pediatric care'] },
    { name: 'Phimosis Treatment', slug: 'phimosis', brief: 'Treatment for tight foreskin.', recovery: '5-7 days', costRange: '₹15,000 - ₹35,000', procedure: 'Preputioplasty or circumcision to treat tight foreskin that cannot be retracted.', benefits: ['Multiple options', 'Quick procedure', 'Painless recovery', 'Daycare surgery', 'Expert care'] },
    { name: 'Frenuloplasty', slug: 'frenuloplasty', brief: 'Repair of short penile frenulum.', recovery: '3-5 days', costRange: '₹10,000 - ₹25,000', procedure: 'Surgical lengthening of the frenulum (the band connecting foreskin to glans) to relieve tightness.', benefits: ['Quick procedure', 'Minimal pain', 'Preserves foreskin', 'Fast healing', 'Outpatient surgery'] },
    { name: 'Penile Implant', slug: 'penile-implant', brief: 'Prosthetic treatment for erectile dysfunction.', recovery: '4-6 weeks', costRange: '₹2,00,000 - ₹6,00,000', procedure: 'Surgical insertion of inflatable or semi-rigid penile prosthesis for treatment of refractory erectile dysfunction.', benefits: ['Permanent solution', 'Natural appearance', 'High satisfaction rate', 'Confidential care', 'Expert surgeons'] },
    { name: 'Testicular Biopsy', slug: 'testicular-biopsy', brief: 'Tissue sampling for fertility assessment.', recovery: '2-3 days', costRange: '₹15,000 - ₹35,000', procedure: 'Small incision biopsy of testicular tissue for evaluation of sperm production and fertility assessment.', benefits: ['Accurate diagnosis', 'Quick procedure', 'Fertility assessment', 'Minimal discomfort', 'Expert andrologists'] },
    { name: 'Epididymal Cyst Removal', slug: 'epididymal-cyst', brief: 'Surgical removal of scrotal cysts.', recovery: '1-2 weeks', costRange: '₹20,000 - ₹50,000', procedure: 'Surgical excision of the epididymal cyst under local or general anesthesia.', benefits: ['Permanent removal', 'Quick procedure', 'Minimal scarring', 'Low recurrence', 'Expert care'] },
    { name: 'PCNL (Percutaneous Nephrolithotomy)', slug: 'pcnl', brief: 'Keyhole surgery for large kidney stones.', recovery: '5-7 days', costRange: '₹60,000 - ₹1,80,000', procedure: 'Small puncture through the back to access and remove large kidney stones using ultrasonic or laser energy.', benefits: ['Treats large stones', 'High clearance rate', 'Single sitting', 'Expert urologists', 'Advanced equipment'] },
    { name: 'TURP (Transurethral Resection)', slug: 'turp', brief: 'Endoscopic prostate tissue removal.', recovery: '1-2 weeks', costRange: '₹50,000 - ₹1,30,000', procedure: 'Bipolar or laser TURP to remove obstructing prostate tissue through the urethra.', benefits: ['No external incision', 'Immediate relief', 'Short hospital stay', 'Advanced bipolar tech', 'Expert urologists'] },
    { name: 'Penile Curvature Correction', slug: 'penile-curvature', brief: "Treatment for Peyronie's disease.", recovery: '4-6 weeks', costRange: '₹50,000 - ₹1,50,000', procedure: "Surgical correction of penile curvature caused by Peyronie's disease using plication or grafting techniques.", benefits: ['Improved function', 'Expert andrologists', 'Confidential care', 'Multiple techniques', 'High success rate'] },
    { name: 'Urethral Diverticulum', slug: 'urethral-diverticulum', brief: 'Surgical repair of urethral outpouching.', recovery: '2-4 weeks', costRange: '₹40,000 - ₹1,00,000', procedure: 'Surgical excision and repair of the urethral diverticulum through a vaginal or perineal approach.', benefits: ['Symptom relief', 'Expert reconstruction', 'Minimally invasive', 'Low recurrence', 'Comprehensive care'] },
    { name: 'Lithotripsy (ESWL)', slug: 'lithotripsy', brief: 'Non-invasive shock wave stone treatment.', recovery: '1-2 days', costRange: '₹20,000 - ₹50,000', procedure: 'Extracorporeal Shock Wave Lithotripsy — focused shock waves break kidney stones into small fragments that pass naturally.', benefits: ['Non-invasive', 'No anesthesia needed', 'Outpatient procedure', 'Quick recovery', 'Painless treatment'] },
  ],
  vascular: [
    { name: 'Varicose Veins Treatment', slug: 'varicose-veins', brief: 'Laser treatment for varicose veins.', recovery: '2-3 days', costRange: '₹40,000 - ₹1,00,000', procedure: 'Endovenous Laser Ablation (EVLA) or radiofrequency ablation to seal damaged veins and redirect blood flow.', benefits: ['No cuts or stitches', 'Walk same day', 'Daycare procedure', 'Minimal pain', 'Cosmetically superior'] },
    { name: 'DVT Treatment', slug: 'dvt-treatment', brief: 'Deep vein thrombosis management.', recovery: '2-4 weeks', costRange: '₹50,000 - ₹1,50,000', procedure: 'Catheter-directed thrombolysis or mechanical thrombectomy to remove blood clots from deep veins.', benefits: ['Prevents complications', 'Minimally invasive', 'Expert vascular surgeons', 'Quick clot removal', 'Comprehensive follow-up'] },
    { name: 'AV Fistula Creation', slug: 'av-fistula', brief: 'Vascular access for dialysis.', recovery: '2-4 weeks', costRange: '₹25,000 - ₹60,000', procedure: 'Surgical connection of an artery and vein, usually in the arm, to create reliable dialysis access.', benefits: ['Reliable dialysis access', 'Long-lasting', 'Expert vascular surgeons', 'Lower infection risk', 'Better flow rates'] },
    { name: 'Peripheral Artery Disease', slug: 'peripheral-artery', brief: 'Treatment for blocked leg arteries.', recovery: '2-4 weeks', costRange: '₹60,000 - ₹2,00,000', procedure: 'Angioplasty, stenting, or bypass surgery to restore blood flow in narrowed or blocked peripheral arteries.', benefits: ['Improved circulation', 'Limb salvage', 'Minimally invasive options', 'Expert interventionalists', 'Comprehensive care'] },
    { name: 'Aortic Aneurysm Repair', slug: 'aortic-aneurysm', brief: 'Repair of weakened aorta.', recovery: '4-8 weeks', costRange: '₹2,00,000 - ₹6,00,000', procedure: 'Endovascular or open surgical repair to reinforce the weakened wall of the aorta and prevent rupture.', benefits: ['Life-saving procedure', 'Endovascular option', 'Expert vascular team', 'ICU support', 'Comprehensive rehab'] },
    { name: 'Diabetic Foot Treatment', slug: 'diabetic-foot', brief: 'Comprehensive diabetic foot care.', recovery: '2-6 weeks', costRange: '₹30,000 - ₹1,00,000', procedure: 'Wound management, debridement, vascular intervention, and reconstruction for diabetic foot complications.', benefits: ['Limb preservation', 'Multi-disciplinary care', 'Advanced wound care', 'Vascular assessment', 'Preventive guidance'] },
  ],
  aesthetics: [
    { name: 'Hair Transplant (FUE/FUT)', slug: 'hair-transplant', brief: 'Permanent hair restoration surgery.', recovery: '7-10 days', costRange: '₹40,000 - ₹2,00,000', procedure: 'Follicular Unit Extraction (FUE) or Strip method to transplant hair follicles from donor to balding areas.', benefits: ['Natural-looking results', 'Permanent solution', 'No visible scarring (FUE)', 'Same-day procedure', 'Expert trichologists'] },
    { name: 'Rhinoplasty (Nose Job)', slug: 'rhinoplasty', brief: 'Surgical reshaping of the nose.', recovery: '2-3 weeks', costRange: '₹50,000 - ₹2,00,000', procedure: 'Open or closed rhinoplasty to reshape nasal structure for cosmetic or functional improvement.', benefits: ['Customized results', 'Improved breathing', 'Expert plastic surgeons', 'Natural appearance', '3D planning available'] },
    { name: 'Liposuction', slug: 'liposuction', brief: 'Fat removal and body contouring.', recovery: '1-2 weeks', costRange: '₹50,000 - ₹2,50,000', procedure: 'VASER or tumescent liposuction to remove stubborn fat deposits from targeted body areas.', benefits: ['Immediate contouring', 'Minimal scarring', 'Multiple area treatment', 'Advanced VASER tech', 'Quick recovery'] },
    { name: 'Gynecomastia Surgery', slug: 'gynecomastia', brief: 'Male breast reduction surgery.', recovery: '1-2 weeks', costRange: '₹40,000 - ₹1,20,000', procedure: 'Liposuction and gland excision to treat enlarged male breast tissue for a flatter chest contour.', benefits: ['Immediate results', 'Minimal scarring', 'Permanent solution', 'Confidence boost', 'Expert surgeons'] },
    { name: 'Tummy Tuck (Abdominoplasty)', slug: 'tummy-tuck', brief: 'Abdominal contouring surgery.', recovery: '3-4 weeks', costRange: '₹80,000 - ₹2,50,000', procedure: 'Removal of excess skin and fat with abdominal muscle tightening for a firmer, flatter abdomen.', benefits: ['Dramatic improvement', 'Muscle repair included', 'Customizable procedure', 'Improved posture', 'Expert body contouring'] },
    { name: 'Face Lift (Rhytidectomy)', slug: 'face-lift', brief: 'Facial rejuvenation surgery.', recovery: '2-3 weeks', costRange: '₹1,00,000 - ₹3,50,000', procedure: 'Surgical lifting and tightening of facial tissues to reduce sagging, wrinkles, and signs of aging.', benefits: ['Youthful appearance', 'Long-lasting results', 'Natural look', 'Expert plastic surgeons', 'Comprehensive planning'] },
    { name: 'Blepharoplasty (Eyelid Surgery)', slug: 'blepharoplasty', brief: 'Eyelid lifting and rejuvenation.', recovery: '1-2 weeks', costRange: '₹40,000 - ₹1,20,000', procedure: 'Removal of excess skin, muscle, and fat from upper or lower eyelids for a refreshed appearance.', benefits: ['Brighter, younger eyes', 'Improved vision (upper)', 'Minimal scarring', 'Quick recovery', 'Natural results'] },
    { name: 'Otoplasty (Ear Reshaping)', slug: 'otoplasty', brief: 'Surgical correction of ear shape or position.', recovery: '1-2 weeks', costRange: '₹35,000 - ₹90,000', procedure: 'Reshaping or repositioning of the ears closer to the head for improved symmetry and appearance.', benefits: ['Improved symmetry', 'Permanent results', 'Minimal scarring', 'Quick procedure', 'Boosts confidence'] },
    { name: 'Breast Augmentation', slug: 'breast-augmentation', brief: 'Breast enhancement surgery.', recovery: '2-4 weeks', costRange: '₹80,000 - ₹3,00,000', procedure: 'Placement of silicone or saline implants or fat transfer for breast enhancement and reshaping.', benefits: ['Customizable size', 'Natural feel options', 'Expert plastic surgeons', 'FDA-approved implants', 'Boosted confidence'] },
    { name: 'Breast Reduction', slug: 'breast-reduction', brief: 'Surgical breast size reduction.', recovery: '2-4 weeks', costRange: '₹70,000 - ₹2,00,000', procedure: 'Removal of excess breast tissue, fat, and skin to achieve a proportionate breast size and relieve discomfort.', benefits: ['Pain relief', 'Improved posture', 'Better proportions', 'Reduced skin irritation', 'Expert surgeons'] },
    { name: 'Fat Transfer / Fat Grafting', slug: 'fat-transfer', brief: 'Natural fat-based body contouring.', recovery: '1-2 weeks', costRange: '₹50,000 - ₹1,50,000', procedure: 'Harvesting fat via liposuction from one area and injecting it into another for natural volume enhancement.', benefits: ['Natural results', 'Dual benefit', 'No foreign materials', 'Long-lasting', 'Body contouring'] },
    { name: 'Chin Augmentation', slug: 'chin-augmentation', brief: 'Chin enhancement and reshaping.', recovery: '1-2 weeks', costRange: '₹40,000 - ₹1,20,000', procedure: 'Implant placement or fat grafting to enhance chin projection and improve facial profile.', benefits: ['Improved profile', 'Permanent results', 'Quick procedure', 'Minimal scarring', 'Expert surgeons'] },
    { name: 'Lip Augmentation', slug: 'lip-augmentation', brief: 'Lip enhancement procedures.', recovery: '3-5 days', costRange: '₹15,000 - ₹60,000', procedure: 'Dermal filler injection or fat transfer to add volume, shape, and definition to the lips.', benefits: ['Immediate results', 'Natural appearance', 'Quick procedure', 'Reversible (fillers)', 'Minimal downtime'] },
    { name: 'Buccal Fat Removal', slug: 'buccal-fat', brief: 'Cheek fat reduction for facial slimming.', recovery: '1-2 weeks', costRange: '₹40,000 - ₹90,000', procedure: 'Removal of buccal fat pads through small incisions inside the mouth for a slimmer facial contour.', benefits: ['Defined cheekbones', 'No visible scarring', 'Quick procedure', 'Permanent results', 'Natural look'] },
    { name: 'Dimple Creation', slug: 'dimple-creation', brief: 'Surgical creation of facial dimples.', recovery: '3-5 days', costRange: '₹15,000 - ₹35,000', procedure: 'Small internal suture placed through the cheek to create a natural-looking dimple when smiling.', benefits: ['Natural appearance', 'Quick procedure', 'Local anesthesia', 'Permanent results', 'Minimal recovery'] },
    { name: 'Scar Revision', slug: 'scar-revision', brief: 'Surgical and laser scar treatment.', recovery: '1-2 weeks', costRange: '₹20,000 - ₹80,000', procedure: 'Surgical excision, laser resurfacing, or dermabrasion to minimize the appearance of scars.', benefits: ['Improved appearance', 'Multiple techniques', 'Expert assessment', 'Customized treatment', 'Better skin texture'] },
    { name: 'Thread Lift', slug: 'thread-lift', brief: 'Non-surgical facial lifting with threads.', recovery: '3-5 days', costRange: '₹30,000 - ₹1,00,000', procedure: 'Insertion of absorbable threads under the skin to lift and tighten sagging facial tissues.', benefits: ['Non-surgical option', 'Immediate lifting', 'Collagen stimulation', 'Quick procedure', 'Minimal downtime'] },
    { name: 'Botox Treatment', slug: 'botox', brief: 'Wrinkle reduction with botulinum toxin.', recovery: 'No downtime', costRange: '₹8,000 - ₹30,000', procedure: 'Precise injection of botulinum toxin to relax facial muscles and smooth wrinkles and fine lines.', benefits: ['Quick results', 'No downtime', 'Non-invasive', 'Preventive aging care', 'Expert injectors'] },
    { name: 'Dermal Fillers', slug: 'dermal-fillers', brief: 'Volume restoration with injectable fillers.', recovery: 'No downtime', costRange: '₹15,000 - ₹50,000', procedure: 'Injection of hyaluronic acid or other fillers to restore volume, smooth wrinkles, and enhance facial features.', benefits: ['Instant results', 'Natural appearance', 'Reversible', 'No surgery needed', 'Minimal discomfort'] },
  ],
  orthopedics: [
    { name: 'Knee Replacement', slug: 'knee-replacement', brief: 'Total or partial knee joint replacement.', recovery: '6-8 weeks', costRange: '₹1,50,000 - ₹4,00,000', procedure: 'Replacement of damaged knee joint surfaces with artificial implants for pain-free mobility.', benefits: ['Pain-free walking', 'Improved mobility', 'Long-lasting implants', 'Computer-navigated surgery', 'Rapid rehab protocol'] },
    { name: 'Hip Replacement', slug: 'hip-replacement', brief: 'Total hip joint replacement surgery.', recovery: '6-8 weeks', costRange: '₹1,80,000 - ₹4,50,000', procedure: 'Replacement of the damaged hip joint with a prosthetic implant for pain relief and restored function.', benefits: ['Pain elimination', 'Restored mobility', 'Durable implants', 'Anterior approach option', 'Expert joint surgeons'] },
    { name: 'ACL Reconstruction', slug: 'acl-reconstruction', brief: 'Anterior cruciate ligament repair.', recovery: '6-9 months', costRange: '₹80,000 - ₹2,00,000', procedure: 'Arthroscopic reconstruction of the torn ACL using hamstring or patellar tendon graft.', benefits: ['Arthroscopic technique', 'Return to sports', 'Strong graft options', 'Expert sports surgeons', 'Structured rehab'] },
    { name: 'Rotator Cuff Repair', slug: 'rotator-cuff', brief: 'Shoulder tendon repair surgery.', recovery: '4-6 months', costRange: '₹70,000 - ₹1,80,000', procedure: 'Arthroscopic repair of torn rotator cuff tendons to restore shoulder strength and range of motion.', benefits: ['Arthroscopic precision', 'Pain relief', 'Restored strength', 'Expert shoulder surgeons', 'Guided rehabilitation'] },
    { name: 'Spine Surgery', slug: 'spine-surgery', brief: 'Minimally invasive spinal procedures.', recovery: '4-8 weeks', costRange: '₹1,00,000 - ₹5,00,000', procedure: 'Discectomy, laminectomy, spinal fusion, or disc replacement using minimally invasive techniques.', benefits: ['Minimally invasive', 'Quick pain relief', 'Expert spine surgeons', 'Advanced imaging', 'Shorter hospital stay'] },
    { name: 'Carpal Tunnel Release', slug: 'carpal-tunnel', brief: 'Treatment for carpal tunnel syndrome.', recovery: '2-4 weeks', costRange: '₹25,000 - ₹60,000', procedure: 'Surgical release of the transverse carpal ligament to relieve pressure on the median nerve.', benefits: ['Immediate relief', 'Quick procedure', 'Endoscopic option', 'Minimal scarring', 'Return to work quickly'] },
    { name: 'Fracture Fixation (ORIF)', slug: 'fracture-fixation', brief: 'Surgical repair of complex fractures.', recovery: '6-12 weeks', costRange: '₹40,000 - ₹1,50,000', procedure: 'Open Reduction Internal Fixation using plates, screws, or rods to align and stabilize broken bones.', benefits: ['Accurate alignment', 'Strong fixation', 'Expert trauma surgeons', 'Early mobilization', 'Better outcomes'] },
    { name: 'Arthroscopy', slug: 'arthroscopy', brief: 'Keyhole joint surgery and diagnosis.', recovery: '2-6 weeks', costRange: '₹40,000 - ₹1,20,000', procedure: 'Camera-guided surgery through small incisions to diagnose and treat joint conditions.', benefits: ['Minimally invasive', 'Quick recovery', 'Diagnostic + therapeutic', 'Small incisions', 'Less joint stiffness'] },
    { name: 'Bunion Surgery', slug: 'bunion-surgery', brief: 'Correction of bunion deformity.', recovery: '4-6 weeks', costRange: '₹40,000 - ₹90,000', procedure: 'Surgical realignment of the big toe joint to correct bunion deformity and relieve pain.', benefits: ['Permanent correction', 'Improved walking', 'Cosmetic improvement', 'Modern techniques', 'Expert foot surgeons'] },
    { name: 'Trigger Finger Release', slug: 'trigger-finger', brief: 'Treatment for locked finger.', recovery: '1-2 weeks', costRange: '₹15,000 - ₹35,000', procedure: 'Release of the thickened tendon sheath to allow smooth finger movement.', benefits: ['Quick procedure', 'Immediate relief', 'Local anesthesia', 'Minimal downtime', 'Return to activities'] },
    { name: 'Tennis Elbow Treatment', slug: 'tennis-elbow', brief: 'Treatment for lateral epicondylitis.', recovery: '3-6 weeks', costRange: '₹20,000 - ₹50,000', procedure: 'PRP injection, shockwave therapy, or arthroscopic debridement for chronic tennis elbow.', benefits: ['Non-surgical options first', 'Expert diagnosis', 'PRP available', 'Quick relief', 'Guided rehabilitation'] },
    { name: 'Ligament Repair', slug: 'ligament-repair', brief: 'Surgical repair of torn ligaments.', recovery: '3-6 months', costRange: '₹60,000 - ₹1,80,000', procedure: 'Arthroscopic or open repair/reconstruction of damaged ligaments in knee, ankle, or shoulder.', benefits: ['Arthroscopic option', 'Strong reconstruction', 'Sports medicine expertise', 'Structured rehab', 'Return to activity'] },
    { name: 'Joint Fusion (Arthrodesis)', slug: 'joint-fusion', brief: 'Surgical fusion of joint bones.', recovery: '6-12 weeks', costRange: '₹50,000 - ₹1,50,000', procedure: 'Permanent fusion of joint surfaces to eliminate pain in severely damaged or arthritic joints.', benefits: ['Complete pain relief', 'Stable joint', 'Expert orthopedic team', 'Multiple joint options', 'Long-term solution'] },
  ],
  ophthalmology: [
    { name: 'Cataract Surgery', slug: 'cataract-surgery', brief: 'Phacoemulsification with IOL implant.', recovery: '1-3 days', costRange: '₹20,000 - ₹1,00,000', procedure: 'Micro-incision phacoemulsification to remove the cloudy lens and replace with an artificial intraocular lens (IOL).', benefits: ['Painless procedure', 'Quick vision restoration', 'Premium IOL options', 'No stitches', 'Same-day procedure'] },
    { name: 'LASIK Eye Surgery', slug: 'lasik-surgery', brief: 'Laser vision correction for spectacle removal.', recovery: '1-2 days', costRange: '₹25,000 - ₹1,00,000', procedure: 'Excimer laser reshaping of the cornea to correct myopia, hyperopia, and astigmatism for spectacle-free vision.', benefits: ['Spectacle freedom', 'Quick 15-min procedure', 'Painless', 'Immediate improvement', 'FDA-approved lasers'] },
    { name: 'ICL Surgery', slug: 'icl-surgery', brief: 'Implantable collamer lens for high power.', recovery: '2-3 days', costRange: '₹60,000 - ₹1,50,000', procedure: 'Implantation of a biocompatible lens inside the eye for correction of high myopia or thin corneas.', benefits: ['High power correction', 'Reversible procedure', 'UV protection built-in', 'No dry eye risk', 'Superior vision quality'] },
    { name: 'Retinal Detachment Surgery', slug: 'retinal-detachment', brief: 'Surgical reattachment of the retina.', recovery: '2-4 weeks', costRange: '₹40,000 - ₹1,50,000', procedure: 'Vitrectomy, scleral buckle, or pneumatic retinopexy to reattach the retina and restore vision.', benefits: ['Vision preservation', 'Emergency availability', 'Expert retina surgeons', 'Advanced equipment', 'Comprehensive follow-up'] },
    { name: 'Glaucoma Surgery', slug: 'glaucoma-surgery', brief: 'Surgical treatment for high eye pressure.', recovery: '2-4 weeks', costRange: '₹30,000 - ₹1,20,000', procedure: 'Trabeculectomy, tube shunt, or MIGS (Minimally Invasive Glaucoma Surgery) to reduce intraocular pressure.', benefits: ['Pressure control', 'Vision preservation', 'MIGS options', 'Expert glaucoma specialists', 'Prevents blindness'] },
    { name: 'Squint Correction', slug: 'squint-correction', brief: 'Surgical alignment of misaligned eyes.', recovery: '1-2 weeks', costRange: '₹30,000 - ₹80,000', procedure: 'Adjustment of eye muscles to correct strabismus (misalignment) and restore binocular vision.', benefits: ['Improved alignment', 'Better depth perception', 'Cosmetic improvement', 'Expert strabismologists', 'Child-friendly care'] },
    { name: 'Pterygium Surgery', slug: 'pterygium-surgery', brief: 'Removal of eye surface growth.', recovery: '1-2 weeks', costRange: '₹15,000 - ₹40,000', procedure: 'Excision of the pterygium with conjunctival autograft to prevent recurrence.', benefits: ['Low recurrence with graft', 'Improved vision', 'Quick procedure', 'Cosmetic improvement', 'Expert eye surgeons'] },
    { name: 'Corneal Transplant', slug: 'corneal-transplant', brief: 'Replacement of damaged cornea.', recovery: '3-6 months', costRange: '₹50,000 - ₹2,00,000', procedure: 'Full thickness (PKP) or partial thickness (DALK/DSEK) corneal transplantation from donor tissue.', benefits: ['Vision restoration', 'Expert cornea specialists', 'Advanced techniques', 'Eye bank support', 'Long-term follow-up'] },
    { name: 'Vitrectomy', slug: 'vitrectomy', brief: 'Removal of vitreous gel from the eye.', recovery: '2-4 weeks', costRange: '₹40,000 - ₹1,50,000', procedure: 'Micro-incision vitrectomy to remove vitreous gel and treat retinal conditions, macular holes, or floaters.', benefits: ['Vision improvement', 'Micro-incision technique', 'Expert retina surgeons', 'Treats multiple conditions', 'Advanced equipment'] },
    { name: 'YAG Laser Capsulotomy', slug: 'yag-laser', brief: 'Post-cataract vision correction.', recovery: 'Same day', costRange: '₹5,000 - ₹15,000', procedure: 'YAG laser to create an opening in the cloudy posterior capsule that can develop after cataract surgery.', benefits: ['5-minute procedure', 'Painless', 'Immediate improvement', 'No anesthesia needed', 'Outpatient procedure'] },
    { name: 'Oculoplasty', slug: 'oculoplasty', brief: 'Eyelid and orbital surgery.', recovery: '1-2 weeks', costRange: '₹25,000 - ₹80,000', procedure: 'Reconstructive or cosmetic surgery of the eyelids, tear ducts, and eye socket area.', benefits: ['Functional improvement', 'Cosmetic enhancement', 'Expert oculoplastic surgeons', 'Minimal scarring', 'Quick recovery'] },
    { name: 'Chalazion Surgery', slug: 'chalazion-surgery', brief: 'Removal of eyelid cyst.', recovery: '3-5 days', costRange: '₹5,000 - ₹15,000', procedure: 'Incision and curettage of the chalazion (blocked meibomian gland cyst) from inside the eyelid.', benefits: ['Quick procedure', 'No visible scar', 'Immediate relief', 'Local anesthesia', 'Outpatient procedure'] },
    { name: 'Blocked Tear Duct Surgery (DCR)', slug: 'blocked-tear-duct', brief: 'Restoration of tear drainage.', recovery: '1-2 weeks', costRange: '₹30,000 - ₹70,000', procedure: 'Dacryocystorhinostomy (DCR) to create a new passage for tear drainage, either external or endoscopic.', benefits: ['Stops watering', 'Endoscopic option', 'High success rate', 'No visible scar (endo)', 'Expert eye surgeons'] },
  ],
  fertility: [
    { name: 'IVF Treatment', slug: 'ivf-treatment', brief: 'In-vitro fertilization for assisted conception.', recovery: '2-3 days (egg retrieval)', costRange: '₹1,00,000 - ₹3,00,000', procedure: 'Ovarian stimulation, egg retrieval, fertilization in lab, embryo culture, and transfer to uterus.', benefits: ['High success rates', 'Expert embryologists', 'Advanced lab facilities', 'Personalized protocols', 'Emotional support included'] },
    { name: 'IUI Treatment', slug: 'iui-treatment', brief: 'Intrauterine insemination for fertility.', recovery: 'Same day', costRange: '₹10,000 - ₹25,000', procedure: 'Washed and concentrated sperm placed directly in the uterus during ovulation window.', benefits: ['Less invasive than IVF', 'Quick procedure', 'Lower cost', 'Natural conception aid', 'Multiple cycles possible'] },
    { name: 'ICSI Treatment', slug: 'icsi-treatment', brief: 'Intracytoplasmic sperm injection.', recovery: '2-3 days', costRange: '₹1,20,000 - ₹3,50,000', procedure: 'Single sperm directly injected into egg cytoplasm, followed by embryo culture and transfer.', benefits: ['Treats severe male factor', 'High fertilization rate', 'Expert micromanipulation', 'Combined with IVF', 'Advanced lab'] },
    { name: 'Egg Freezing', slug: 'egg-freezing', brief: 'Oocyte cryopreservation for future use.', recovery: '1-2 days', costRange: '₹80,000 - ₹1,50,000', procedure: 'Ovarian stimulation and egg retrieval followed by vitrification (flash-freezing) for long-term storage.', benefits: ['Fertility preservation', 'No time pressure', 'Advanced vitrification', 'Flexible timeline', 'Expert care'] },
    { name: 'Fertility Assessment', slug: 'fertility-assessment', brief: 'Comprehensive fertility evaluation.', recovery: 'No downtime', costRange: '₹5,000 - ₹20,000', procedure: 'Hormonal testing, ultrasound, semen analysis, HSG, and genetic screening for complete fertility picture.', benefits: ['Complete evaluation', 'Both partners assessed', 'Personalized plan', 'Expert counseling', 'Early intervention'] },
    { name: 'Hysteroscopy (Fertility)', slug: 'hysteroscopy-fertility', brief: 'Uterine evaluation and treatment for fertility.', recovery: '1-2 days', costRange: '₹20,000 - ₹50,000', procedure: 'Camera-guided examination and treatment of uterine cavity to remove polyps, fibroids, or septum.', benefits: ['Improves implantation', 'Diagnostic + therapeutic', 'Quick procedure', 'No incisions', 'Fertility optimization'] },
  ],
  'weight-loss': [
    { name: 'Bariatric Surgery', slug: 'bariatric-surgery', brief: 'Surgical weight loss — sleeve gastrectomy or bypass.', recovery: '2-4 weeks', costRange: '₹2,00,000 - ₹5,00,000', procedure: 'Laparoscopic sleeve gastrectomy or Roux-en-Y gastric bypass to reduce stomach size and aid weight loss.', benefits: ['Significant weight loss', 'Diabetes improvement', 'Laparoscopic approach', 'Expert bariatric team', 'Lifelong support program'] },
    { name: 'Intragastric Balloon', slug: 'gastric-balloon', brief: 'Non-surgical weight loss balloon.', recovery: '2-3 days', costRange: '₹1,00,000 - ₹2,50,000', procedure: 'Endoscopic placement of a saline-filled balloon in the stomach to reduce capacity and promote satiety.', benefits: ['Non-surgical', 'Reversible', 'Significant weight loss', 'No hospital stay', 'Dietary support included'] },
    { name: 'Body Contouring (Post Weight Loss)', slug: 'body-contouring', brief: 'Excess skin removal after weight loss.', recovery: '3-6 weeks', costRange: '₹80,000 - ₹3,00,000', procedure: 'Surgical removal of excess skin and tissue from abdomen, arms, thighs after massive weight loss.', benefits: ['Improved body shape', 'Skin irritation relief', 'Confidence boost', 'Expert plastic surgeons', 'Customized approach'] },
  ],
  dermatology: [
    { name: 'Acne Scar Treatment', slug: 'acne-scar-treatment', brief: 'Laser and micro-needling for acne scars.', recovery: '3-5 days', costRange: '₹5,000 - ₹30,000', procedure: 'Fractional CO2 laser, micro-needling RF, or chemical peels to improve acne scar texture and appearance.', benefits: ['Visible improvement', 'Multiple modalities', 'Minimal downtime', 'Customized protocol', 'Expert dermatologists'] },
    { name: 'Laser Hair Removal', slug: 'laser-hair-removal', brief: 'Permanent hair reduction with laser.', recovery: 'No downtime', costRange: '₹3,000 - ₹20,000/session', procedure: 'Diode or Nd:YAG laser targeting hair follicles for long-term hair reduction across body areas.', benefits: ['Long-lasting results', 'Painless with cooling', 'All skin types', 'Quick sessions', 'FDA-approved lasers'] },
    { name: 'PRP Therapy', slug: 'prp-therapy', brief: 'Platelet-rich plasma for skin and hair.', recovery: 'No downtime', costRange: '₹5,000 - ₹15,000/session', procedure: 'Injection of concentrated platelets from own blood to stimulate collagen production and hair growth.', benefits: ['Natural treatment', 'No chemicals', 'Dual benefit (skin + hair)', 'Quick procedure', 'No allergic reactions'] },
    { name: 'Wart Removal', slug: 'wart-removal', brief: 'Laser or electrocautery wart treatment.', recovery: '3-5 days', costRange: '₹2,000 - ₹10,000', procedure: 'Electrocautery, cryotherapy, or laser ablation to remove common, plantar, or genital warts.', benefits: ['Quick removal', 'Multiple techniques', 'Minimal scarring', 'Outpatient procedure', 'Low recurrence'] },
    { name: 'Vitiligo Treatment', slug: 'vitiligo-treatment', brief: 'Medical and surgical vitiligo management.', recovery: '1-2 weeks (surgical)', costRange: '₹10,000 - ₹50,000', procedure: 'Phototherapy, melanocyte transfer, or punch grafting to repigment white patches of skin.', benefits: ['Multiple options', 'Expert dermatologists', 'Customized approach', 'Phototherapy available', 'Long-term management'] },
    { name: 'Chemical Peel', slug: 'chemical-peel', brief: 'Skin resurfacing with chemical solutions.', recovery: '3-7 days', costRange: '₹3,000 - ₹15,000', procedure: 'Application of chemical solution to exfoliate damaged skin layers and reveal smoother, brighter skin.', benefits: ['Improved texture', 'Even skin tone', 'Quick procedure', 'Minimal downtime', 'Multiple peel options'] },
    { name: 'Mole Removal', slug: 'mole-removal', brief: 'Surgical or laser mole excision.', recovery: '3-5 days', costRange: '₹3,000 - ₹15,000', procedure: 'Surgical excision, shave removal, or laser ablation of moles with histopathological examination.', benefits: ['Quick procedure', 'Biopsy included', 'Minimal scarring', 'Expert assessment', 'Cosmetically superior'] },
  ],
  'general-surgery': [
    { name: 'Appendectomy', slug: 'appendectomy-gen', brief: 'Surgical removal of the appendix.', recovery: '1-3 weeks', costRange: '₹35,000 - ₹80,000', procedure: 'Laparoscopic or open removal of inflamed appendix to prevent rupture.', benefits: ['Prevents peritonitis', 'Quick relief', 'Minimally invasive options', 'Short hospital stay', 'Expert surgeons'] },
    { name: 'Hernia Repair', slug: 'hernia-repair-gen', brief: 'Surgical correction of hernia.', recovery: '2-4 weeks', costRange: '₹40,000 - ₹1,20,000', procedure: 'Mesh placement via open or laparoscopic surgery to reinforce weakened abdominal wall.', benefits: ['Prevents complications', 'Minimally invasive', 'Low recurrence rate', 'Quick recovery', 'Durable mesh'] },
    { name: 'Gallbladder Removal', slug: 'gallbladder-removal-gen', brief: 'Cholecystectomy for gallstones.', recovery: '1-2 weeks', costRange: '₹45,000 - ₹1,00,000', procedure: 'Laparoscopic removal of the gallbladder containing stones.', benefits: ['Eliminates gallstone pain', 'Prevents future stones', 'Tiny incisions', 'Fast recovery', 'Same-day discharge possible'] },
    { name: 'Thyroid Surgery', slug: 'thyroid-surgery-gen', brief: 'Partial or total removal of thyroid.', recovery: '2-3 weeks', costRange: '₹60,000 - ₹1,50,000', procedure: 'Surgical removal of thyroid gland for nodules, cysts, or hyperthyroidism.', benefits: ['Resolves thyroid issues', 'Nerve monitoring', 'Minimal scarring', 'Expert endocrinologists', 'Comprehensive care'] },
    { name: 'Breast Surgery', slug: 'breast-surgery-gen', brief: 'Surgical procedures for breast conditions.', recovery: '2-4 weeks', costRange: '₹50,000 - ₹2,00,000', procedure: 'Lumpectomy or mastectomy for benign or malignant breast lumps.', benefits: ['Accurate diagnosis', 'Tumor removal', 'Expert oncologists', 'Cosmetic considerations', 'Complete follow-up'] },
    { name: 'Colon Surgery', slug: 'colon-surgery-gen', brief: 'Surgical treatment for colon issues.', recovery: '4-6 weeks', costRange: '₹1,00,000 - ₹3,00,000', procedure: 'Removal of a portion of the colon for polyps, cancer, or diverticulitis.', benefits: ['Treats severe conditions', 'Laparoscopic options', 'Experienced surgical team', 'Comprehensive recovery plan', 'Improves quality of life'] },
    { name: 'Spleen Removal', slug: 'splenectomy-gen', brief: 'Surgical removal of the spleen.', recovery: '4-6 weeks', costRange: '₹80,000 - ₹2,00,000', procedure: 'Laparoscopic or open splenectomy for blood disorders or trauma.', benefits: ['Resolves blood disorders', 'Minimally invasive option', 'Expert surgical care', 'Infection prevention plan', 'Safe procedure'] },
    { name: 'Wound Debridement', slug: 'wound-debridement-gen', brief: 'Removal of dead tissue from wounds.', recovery: '1-3 weeks', costRange: '₹15,000 - ₹50,000', procedure: 'Surgical cleaning of severe or chronic wounds to promote healing.', benefits: ['Prevents infection', 'Promotes faster healing', 'Expert wound care', 'Pain relief', 'Improves tissue health'] },
    { name: 'Laparoscopic Surgery', slug: 'laparoscopic-surgery-gen', brief: 'Minimally invasive diagnostic surgery.', recovery: '1-2 weeks', costRange: '₹30,000 - ₹80,000', procedure: 'Use of a camera to examine abdominal organs or perform minor repairs.', benefits: ['Small incisions', 'Less pain', 'Faster recovery', 'Accurate diagnosis', 'Short hospital stay'] },
    { name: 'Abdominal Wall Reconstruction', slug: 'abdominal-reconstruction-gen', brief: 'Repair of complex abdominal hernias.', recovery: '4-8 weeks', costRange: '₹1,00,000 - ₹3,00,000', procedure: 'Complex surgical repair and reinforcement of the abdominal wall.', benefits: ['Restores core strength', 'Prevents hernia recurrence', 'Expert surgical team', 'Customized mesh', 'Improves functionality'] }
  ],
  'pediatric-surgery': [
    { name: 'Pediatric Hernia Repair', slug: 'pediatric-hernia-ped', brief: 'Hernia repair in infants and children.', recovery: '1-2 weeks', costRange: '₹30,000 - ₹80,000', procedure: 'Surgical repair of inguinal or umbilical hernias in pediatric patients.', benefits: ['Safe for children', 'Expert pediatric surgeons', 'Quick recovery', 'Prevents complications', 'Minimal scarring'] },
    { name: 'Undescended Testis Surgery', slug: 'orchidopexy-ped', brief: 'Orchidopexy for children.', recovery: '1-2 weeks', costRange: '₹35,000 - ₹90,000', procedure: 'Surgical movement of an undescended testicle into the scrotum.', benefits: ['Preserves fertility', 'Reduces cancer risk', 'Expert pediatric care', 'Cosmetic improvement', 'Child-friendly environment'] },
    { name: 'Circumcision', slug: 'circumcision-ped', brief: 'Surgical removal of foreskin.', recovery: '1-2 weeks', costRange: '₹15,000 - ₹40,000', procedure: 'Removal of the foreskin for medical or personal reasons in children.', benefits: ['Prevents infections', 'Quick procedure', 'Expert pediatric surgeons', 'Safe environment', 'Minimal discomfort'] },
    { name: 'Appendectomy in Children', slug: 'pediatric-appendectomy-ped', brief: 'Removal of infected appendix.', recovery: '1-3 weeks', costRange: '₹40,000 - ₹90,000', procedure: 'Laparoscopic removal of the appendix tailored for pediatric patients.', benefits: ['Emergency availability', 'Laparoscopic approach', 'Faster healing', 'Child-friendly care', 'Prevents rupture'] },
    { name: 'Pyloromyotomy', slug: 'pyloromyotomy-ped', brief: 'Surgery for pyloric stenosis.', recovery: '1-2 weeks', costRange: '₹50,000 - ₹1,20,000', procedure: 'Surgical cutting of the thickened muscle at the stomach outlet in infants.', benefits: ['Resolves vomiting', 'Allows normal feeding', 'Expert pediatric team', 'Quick recovery', 'Life-saving procedure'] },
    { name: 'Intussusception Surgery', slug: 'intussusception-ped', brief: 'Treatment for telescoped bowel.', recovery: '2-4 weeks', costRange: '₹60,000 - ₹1,50,000', procedure: 'Reduction or surgical correction of a folded section of the intestine.', benefits: ['Restores bowel function', 'Emergency care', 'Expert pediatric surgeons', 'Prevents bowel damage', 'Comprehensive follow-up'] },
    { name: 'Cleft Lip & Palate Repair', slug: 'cleft-repair-ped', brief: 'Surgical correction of facial clefts.', recovery: '2-4 weeks', costRange: '₹80,000 - ₹2,50,000', procedure: 'Reconstructive surgery to close gaps in the lip or roof of the mouth.', benefits: ['Improves feeding', 'Enhances speech development', 'Cosmetic improvement', 'Expert plastic surgeons', 'Multidisciplinary care'] },
    { name: 'Pediatric Cyst Removal', slug: 'pediatric-cyst-ped', brief: 'Removal of congenital cysts.', recovery: '1-3 weeks', costRange: '₹30,000 - ₹80,000', procedure: 'Surgical excision of thyroglossal, branchial, or other congenital cysts.', benefits: ['Prevents infection', 'Complete removal', 'Minimal scarring', 'Expert pediatric care', 'Quick recovery'] },
    { name: 'Bowel Resection', slug: 'pediatric-bowel-ped', brief: 'Surgery for intestinal issues.', recovery: '4-6 weeks', costRange: '₹1,00,000 - ₹3,00,000', procedure: 'Removal of diseased or blocked portions of the intestine in children.', benefits: ['Treats severe conditions', 'Restores digestion', 'Expert surgical team', 'NICU/PICU support', 'Comprehensive care'] },
    { name: 'Tongue Tie Release', slug: 'tongue-tie-ped', brief: 'Frenotomy for restricted tongue.', recovery: '1-3 days', costRange: '₹10,000 - ₹25,000', procedure: 'Simple clipping of the lingual frenulum to improve tongue movement.', benefits: ['Improves breastfeeding', 'Enhances speech', 'Quick outpatient procedure', 'Minimal bleeding', 'Immediate results'] }
  ]
};

// =====================================================
// POPULAR TREATMENTS (for homepage scroller)
// =====================================================
const POPULAR_TREATMENTS = [
  { name: 'Knee Replacement', slug: 'knee-replacement', category: 'orthopedics', icon: '🦵' },
  { name: 'Cataract Surgery', slug: 'cataract-surgery', category: 'ophthalmology', icon: '👁️' },
  { name: 'Piles Treatment', slug: 'piles-treatment', category: 'proctology', icon: '🩺' },
  { name: 'Hair Transplant', slug: 'hair-transplant', category: 'aesthetics', icon: '💇' },
  { name: 'Kidney Stone', slug: 'kidney-stone', category: 'urology', icon: '🫘' },
  { name: 'Gallstone Surgery', slug: 'gallbladder-removal', category: 'laparoscopy', icon: '🔬' },
  { name: 'IVF Treatment', slug: 'ivf-treatment', category: 'fertility', icon: '🤱' },
  { name: 'Hernia Repair', slug: 'hernia-repair-lap', category: 'laparoscopy', icon: '🏥' },
  { name: 'LASIK Surgery', slug: 'lasik-surgery', category: 'ophthalmology', icon: '👓' },
  { name: 'Septoplasty', slug: 'septoplasty', category: 'ent', icon: '👃' },
  { name: 'Varicose Veins', slug: 'varicose-veins', category: 'vascular', icon: '🫀' },
  { name: 'Bariatric Surgery', slug: 'bariatric-surgery', category: 'weight-loss', icon: '⚖️' },
];

// =====================================================
// DOCTORS
// =====================================================
const DOCTORS = [
  { slug: 'dr-rajesh-sharma', name: 'Dr. Rajesh Sharma', specialty: 'General & Laparoscopic Surgeon', degree: 'MBBS, MS (General Surgery)', experience: '22+ Years', rating: 4.9, reviews: 328, fee: 1500, image: 'images/doctor-1.png', hospital: 'Apollo Hospitals', location: 'Salt Lake, Kolkata', slots: ['11:00 AM', '12:00 PM', '2:00 PM'], nextSlot: '11:00 AM', language: 'Bengali, Hindi, English', bio: 'Dr. Rajesh Sharma is a highly experienced General & Laparoscopic Surgeon with over 22 years dedicated to surgical care. He practices at Apollo Hospitals, Salt Lake, Kolkata — a centre known for its advanced surgical facilities. His expertise spans laparoscopic procedures, hernia repair, gallbladder surgery, and proctology. He is committed to minimally invasive techniques for faster patient recovery.', categories: ['laparoscopy', 'proctology'] },
  { slug: 'dr-priya-mehta', name: 'Dr. Priya Mehta', specialty: 'Gynaecologist & Obstetrician', degree: 'MBBS, MD (Obstetrics)', experience: '18+ Years', rating: 4.8, reviews: 245, fee: 1200, image: 'images/doctor-2.png', hospital: 'Fortis Hospital', location: 'Anandapur, Kolkata', slots: ['10:30 AM', '1:00 PM', '3:30 PM'], nextSlot: '10:30 AM', language: 'Bengali, English', bio: 'Dr. Priya Mehta is a board-certified Gynaecologist & Obstetrician with 18 years of experience. Practicing at Fortis Hospital, Kolkata, she specialises in high-risk pregnancies, fertility treatments, and minimally invasive gynaecological surgeries. She is known for her compassionate approach and commitment to women\'s health.', categories: ['gynaecology', 'fertility'] },
  { slug: 'dr-anil-kapoor', name: 'Dr. Anil Kapoor', specialty: 'Orthopedic Surgeon', degree: 'MBBS, MS (Orthopaedics)', experience: '25+ Years', rating: 4.9, reviews: 412, fee: 2000, image: 'images/doctor-3.png', hospital: 'AMRI Hospital', location: 'Dhakuria, Kolkata', slots: ['9:00 AM', '11:30 AM', '4:00 PM'], nextSlot: '9:00 AM', language: 'Hindi, English', bio: 'Dr. Anil Kapoor is one of Kolkata\'s most trusted Orthopedic Surgeons with 25 years of experience at AMRI Hospital. He specialises in knee and hip replacements, spine surgery, sports injuries, and arthroscopic procedures. His use of robotic-assisted surgery ensures precision and faster recovery for his patients.', categories: ['orthopedics'] },
  { slug: 'dr-sneha-reddy', name: 'Dr. Sneha Reddy', specialty: 'Ophthalmologist', degree: 'MBBS, MS (Ophthalmology)', experience: '15+ Years', rating: 4.9, reviews: 389, fee: 1000, image: 'images/doctor-4.png', hospital: 'Disha Eye Hospital', location: 'Park Street, Kolkata', slots: ['10:00 AM', '1:30 PM', '3:00 PM'], nextSlot: '10:00 AM', language: 'Bengali, Telugu, English', bio: 'Dr. Sneha Reddy is a leading Ophthalmologist with 15 years of expertise in eye care at Disha Eye Hospital. She specialises in cataract surgery, LASIK, retinal disorders, and glaucoma management. Her patient-first philosophy and cutting-edge techniques have helped thousands regain clear vision.', categories: ['ophthalmology'] },
  { slug: 'dr-vikram-singh', name: 'Dr. Vikram Singh', specialty: 'Urologist & Andrologist', degree: 'MBBS, MCh (Urology)', experience: '20+ Years', rating: 4.8, reviews: 276, fee: 1800, image: 'images/doctor-1.png', hospital: 'Medica Superspecialty', location: 'Mukundapur, Kolkata', slots: ['9:30 AM', '12:30 PM', '2:30 PM'], nextSlot: '9:30 AM', language: 'Hindi, English', bio: 'Dr. Vikram Singh is a highly skilled Urologist & Andrologist with 20 years of practice at Medica Superspecialty Hospital. He specialises in kidney stone treatment, prostate disorders, urinary tract conditions, and male fertility. He is a pioneer in laparoscopic urological procedures in Kolkata.', categories: ['urology'] },
  { slug: 'dr-meera-joshi', name: 'Dr. Meera Joshi', specialty: 'ENT Specialist', degree: 'MBBS, MS (ENT)', experience: '16+ Years', rating: 4.7, reviews: 198, fee: 900, image: 'images/doctor-2.png', hospital: 'RN Tagore Hospital', location: 'Mukundapur, Kolkata', slots: ['11:00 AM', '2:00 PM', '4:30 PM'], nextSlot: '11:00 AM', language: 'Bengali, Marathi, English', bio: 'Dr. Meera Joshi is an experienced ENT Specialist with 16 years at RN Tagore International Institute. She manages a wide range of ear, nose, and throat conditions including sinusitis, hearing loss, tonsillitis, and sleep apnoea. Her minimally invasive endoscopic techniques ensure quick recovery.', categories: ['ent'] },
  { slug: 'dr-arjun-patel', name: 'Dr. Arjun Patel', specialty: 'Plastic & Cosmetic Surgeon', degree: 'MBBS, MCh (Plastic Surgery)', experience: '19+ Years', rating: 4.9, reviews: 356, fee: 2500, image: 'images/doctor-3.png', hospital: 'Columbia Asia Hospital', location: 'Saltlake, Kolkata', slots: ['10:00 AM', '1:00 PM', '3:30 PM'], nextSlot: '10:00 AM', language: 'Gujarati, Hindi, English', bio: 'Dr. Arjun Patel is a renowned Plastic & Cosmetic Surgeon with 19 years of expertise at Columbia Asia Hospital. He specialises in rhinoplasty, hair transplants, body contouring, and reconstructive surgeries. His artistic precision and advanced techniques deliver natural, life-changing results.', categories: ['aesthetics', 'dermatology'] },
  { slug: 'dr-kavita-nair', name: 'Dr. Kavita Nair', specialty: 'Vascular Surgeon', degree: 'MBBS, MCh (Vascular Surgery)', experience: '14+ Years', rating: 4.8, reviews: 167, fee: 1600, image: 'images/doctor-4.png', hospital: 'Peerless Hospital', location: 'Garia, Kolkata', slots: ['9:00 AM', '11:00 AM', '2:00 PM'], nextSlot: '9:00 AM', language: 'Malayalam, Hindi, English', bio: 'Dr. Kavita Nair is a specialist Vascular Surgeon with 14 years at Peerless Hospital, Kolkata. She treats varicose veins, deep vein thrombosis, arterial blockages, and AV fistulas using state-of-the-art endovascular techniques. Her minimally invasive approach ensures minimal downtime for patients.', categories: ['vascular'] },
  { slug: 'dr-rakesh-verma', name: 'Dr. Rakesh Verma', specialty: 'Orthopedic Surgeon', degree: 'MBBS, MS (Orthopaedics)', experience: '21+ Years', rating: 4.8, reviews: 310, fee: 1800, image: 'images/doctor-1.png', hospital: 'Woodlands Hospital', location: 'Alipore, Kolkata', slots: ['10:00 AM', '1:00 PM', '4:30 PM'], nextSlot: '10:00 AM', language: 'Bengali, Hindi, English', bio: 'Dr. Rakesh Verma is a highly sought-after Orthopedic Surgeon with 21 years of experience. He is an expert in joint replacement and arthroscopic surgeries.', categories: ['orthopedics'] },
  { slug: 'dr-sunita-agarwal', name: 'Dr. Sunita Agarwal', specialty: 'Gynaecologist', degree: 'MBBS, DGO, MD (Obstetrics)', experience: '16+ Years', rating: 4.9, reviews: 402, fee: 1400, image: 'images/doctor-2.png', hospital: 'Bhagirathi Neotia', location: 'Park Street, Kolkata', slots: ['9:30 AM', '11:30 AM', '2:00 PM'], nextSlot: '9:30 AM', language: 'Hindi, English', bio: 'Dr. Sunita Agarwal specializes in women’s wellness, high-risk pregnancies, and infertility treatments. She focuses on providing the best possible care to mothers.', categories: ['gynaecology', 'fertility'] },
  { slug: 'dr-amit-desai', name: 'Dr. Amit Desai', specialty: 'General & Laparoscopic Surgeon', degree: 'MBBS, MS (Surgery)', experience: '18+ Years', rating: 4.7, reviews: 215, fee: 1300, image: 'images/doctor-3.png', hospital: 'Ruby General Hospital', location: 'Kasba, Kolkata', slots: ['10:30 AM', '12:30 PM', '3:00 PM'], nextSlot: '10:30 AM', language: 'Bengali, Gujarati, English', bio: 'Dr. Amit Desai is a reputed General Surgeon known for his expertise in laparoscopic and laser surgeries, ensuring minimal scars and fast recovery.', categories: ['laparoscopy', 'proctology'] },
  { slug: 'dr-kiran-rao', name: 'Dr. Kiran Rao', specialty: 'Ophthalmologist', degree: 'MBBS, DO', experience: '12+ Years', rating: 4.8, reviews: 188, fee: 1000, image: 'images/doctor-4.png', hospital: 'Sankara Nethralaya', location: 'Mukundapur, Kolkata', slots: ['9:00 AM', '11:00 AM', '1:30 PM'], nextSlot: '9:00 AM', language: 'Telugu, Hindi, English', bio: 'Dr. Kiran Rao is dedicated to providing clear vision to his patients, specializing in advanced cataract surgeries and refractive corrections like LASIK.', categories: ['ophthalmology'] },
  { slug: 'dr-vikash-anand', name: 'Dr. Vikash Anand', specialty: 'Orthopedic Surgeon', degree: 'MBBS, MS (Ortho), DNB', experience: '15+ Years', rating: 4.7, reviews: 250, fee: 1500, image: 'images/doctor-1.png', hospital: 'Apollo Gleneagles', location: 'Kankurgachi, Kolkata', slots: ['11:30 AM', '2:30 PM', '5:00 PM'], nextSlot: '11:30 AM', language: 'Bengali, Hindi', bio: 'Dr. Vikash Anand focuses on knee and hip replacements and sports medicine, offering customized recovery plans.', categories: ['orthopedics'] },
  { slug: 'dr-neha-sharma', name: 'Dr. Neha Sharma', specialty: 'Orthopedic Surgeon', degree: 'MBBS, MS (Orthopaedics)', experience: '18+ Years', rating: 4.9, reviews: 420, fee: 2000, image: 'images/doctor-2.png', hospital: 'Fortis Hospital', location: 'Anandapur, Kolkata', slots: ['9:00 AM', '1:00 PM', '3:00 PM'], nextSlot: '9:00 AM', language: 'Hindi, English', bio: 'Dr. Neha Sharma specializes in complex joint reconstructions and trauma surgery, ensuring the highest standards of orthopedic care.', categories: ['orthopedics'] },
  // Delhi NCR Doctors
  { slug: 'dr-sandeep-vaishya', name: 'Dr. Sandeep Vaishya', specialty: 'Orthopedic Surgeon', degree: 'MBBS, MS (Orthopaedics)', experience: '20+ Years', rating: 4.9, reviews: 295, fee: 1800, image: 'images/doctor-1.png', hospital: 'Max Super Speciality Hospital', location: 'Saket, Delhi NCR', slots: ['10:00 AM', '12:00 PM', '3:00 PM'], nextSlot: '10:00 AM', language: 'Hindi, English', bio: 'Dr. Sandeep Vaishya is a highly experienced Orthopedic Surgeon with 20+ years of expertise. He practices at Max Super Speciality Hospital, Delhi NCR, specializing in joint replacements and spine surgeries.', categories: ['orthopedics'] },
  { slug: 'dr-amit-kumar', name: 'Dr. Amit Kumar', specialty: 'Cardiology Surgeon', degree: 'MBBS, MS, MCh (Cardiothoracic Surgery)', experience: '18+ Years', rating: 4.8, reviews: 180, fee: 2000, image: 'images/doctor-3.png', hospital: 'Fortis Escorts Heart Institute', location: 'Okhla, Delhi NCR', slots: ['11:00 AM', '1:00 PM', '4:00 PM'], nextSlot: '11:00 AM', language: 'Hindi, Punjabi, English', bio: 'Dr. Amit Kumar is a senior cardiac surgeon at Fortis Escorts, Delhi NCR, with 18+ years of experience in bypass and heart valve surgeries.', categories: ['cardiology'] },
  // Bangalore Doctors
  { slug: 'dr-hv-madhusudan', name: 'Dr. H. V. Madhusudan', specialty: 'Orthopedic Surgeon', degree: 'MBBS, MS (Orthopaedics)', experience: '24+ Years', rating: 4.9, reviews: 340, fee: 1600, image: 'images/doctor-2.png', hospital: 'Manipal Hospital', location: 'HAL Road, Bangalore', slots: ['9:30 AM', '12:30 PM', '3:30 PM'], nextSlot: '9:30 AM', language: 'Kannada, English, Hindi', bio: 'Dr. Madhusudan is a veteran Orthopedic Specialist at Manipal Hospital, Bangalore. He specializes in knee/hip replacements and advanced sports medicine.', categories: ['orthopedics'] },
  { slug: 'dr-shalini-rao', name: 'Dr. Shalini Rao', specialty: 'Gynaecologist', degree: 'MBBS, MD (Gynaecology)', experience: '15+ Years', rating: 4.8, reviews: 215, fee: 1200, image: 'images/doctor-4.png', hospital: 'Aster CMI Hospital', location: 'Hebbal, Bangalore', slots: ['10:00 AM', '2:00 PM', '4:30 PM'], nextSlot: '10:00 AM', language: 'Kannada, English, Telugu', bio: 'Dr. Shalini Rao has 15+ years of experience in women\'s health and high-risk maternity care at Aster CMI Hospital, Bangalore.', categories: ['gynaecology', 'fertility'] },
  // Mumbai Doctors
  { slug: 'dr-sanjay-pandey', name: 'Dr. Sanjay Pandey', specialty: 'Urologist', degree: 'MBBS, MCh (Urology)', experience: '22+ Years', rating: 4.9, reviews: 310, fee: 2200, image: 'images/doctor-1.png', hospital: 'Kokilaben Dhirubhai Ambani Hospital', location: 'Andheri West, Mumbai', slots: ['11:00 AM', '1:00 PM', '5:00 PM'], nextSlot: '11:00 AM', language: 'Marathi, Hindi, English', bio: 'Dr. Sanjay Pandey is a leading Urologist in Mumbai with 22+ years of experience at Kokilaben Hospital. Specializes in laser kidney stone and prostate treatments.', categories: ['urology'] },
  { slug: 'dr-anjali-shah', name: 'Dr. Anjali Shah', specialty: 'General & Laparoscopic Surgeon', degree: 'MBBS, MS (Surgery)', experience: '16+ Years', rating: 4.7, reviews: 198, fee: 1500, image: 'images/doctor-2.png', hospital: 'Nanavati Max Super Speciality Hospital', location: 'Vile Parle, Mumbai', slots: ['10:30 AM', '12:30 PM', '3:00 PM'], nextSlot: '10:30 AM', language: 'Gujarati, Hindi, English, Marathi', bio: 'Dr. Anjali Shah is a senior consultant in Laparoscopic and General Surgery at Nanavati Max, Mumbai, with 16+ years of experience.', categories: ['laparoscopy'] }
];

// =====================================================
// FEATURED HOSPITALS
// =====================================================
const HOSPITALS = [
  {
    slug: 'apollo-hospitals-kolkata',
    name: 'Apollo Hospitals',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Maa%20Durga%202019%20at%20Apollo%20Gleneagles%20Hospital%2C%20Kolkata%20MA05.jpg',
    rating: 4.8,
    reviews: 1240,
    address: 'Salt Lake, Kolkata',
    distance: '2.4 km away',
    city: 'Kolkata',
    type: 'Multispeciality Surgical Hospital',
    phone: '+91-8877772277',
    hours: 'Open 24 hours',
    overview: 'Apollo Hospitals in Salt Lake is a trusted partner hospital for advanced surgical care with modern operation theatres, ICU support, and coordinated admission assistance.',
    services: ['Cashless insurance', 'Modular OT', '24/7 support'],
    metrics: ['610+ Beds', 'JCI Accredited'],
    specialties: ['Laparoscopy', 'Proctology', 'Orthopedics', 'Urology'],
    amenities: ['Insurance desk', 'Pharmacy', 'Diagnostics', 'Cab assistance'],
    map: { left: 56, top: 34, label: 'Salt Lake', lat: 22.5769, lng: 88.4798 },
  },
  {
    slug: 'fortis-hospital-kolkata',
    name: 'Fortis Hospital',
    image: 'https://www.fortishealthcare.com/drupal-data/styles/details_banner_1456_320/azblob/2023-05/Fortis%20Anandapur%20Hospital%20Banner.png?itok=qE249oYI',
    rating: 4.7,
    reviews: 980,
    address: 'Anandapur, Kolkata',
    distance: '5.8 km away',
    city: 'Kolkata',
    type: 'Advanced Surgery Centre',
    phone: '+91-8877772277',
    hours: 'Open 24 hours',
    overview: 'Fortis Hospital in Anandapur offers comprehensive surgical care, experienced consultants, day-care procedures, ICU backup, and guided pre-surgery support.',
    services: ['Free consultation', 'ICU support', 'Day-care surgery'],
    metrics: ['320+ Beds', 'NABH Accredited'],
    specialties: ['Gynaecology', 'Fertility', 'Orthopedics', 'General Surgery'],
    amenities: ['ICU backup', 'Cashless billing', 'Emergency care', 'Patient lounge'],
    map: { left: 63, top: 62, label: 'Anandapur', lat: 22.5149, lng: 88.4009 },
  },
  {
    slug: 'amri-hospital-kolkata',
    name: 'AMRI Hospital',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/AMRI%20Hospital%20-%20Advanced%20Medical%20Research%20Institute%20-%20Dhakuria%20-%20Kolkata%202014-02-12%202008.JPG',
    rating: 4.6,
    reviews: 860,
    address: 'Dhakuria, Kolkata',
    distance: '4.1 km away',
    city: 'Kolkata',
    type: 'Partner Surgical Clinic',
    phone: '+91-8877772277',
    hours: 'Open 24 hours',
    overview: 'AMRI Hospital in Dhakuria is a partner facility for planned surgeries with specialist doctors, advanced surgical infrastructure, EMI options, and care coordination.',
    services: ['Expert surgeons', 'EMI options', 'Cab assistance'],
    metrics: ['500+ Beds', '40+ Specialties'],
    specialties: ['Orthopedics', 'Cardiology', 'Laparoscopy', 'ENT'],
    amenities: ['Modular OT', 'Diagnostics', 'Insurance support', 'Recovery rooms'],
    map: { left: 42, top: 64, label: 'Dhakuria', lat: 22.5086, lng: 88.3679 },
  },
  // Delhi NCR Hospitals
  {
    slug: 'max-hospital-delhi',
    name: 'Max Super Speciality Hospital',
    image: 'https://www.maxhealthcare.in/assets/images/max-healthcare-logo.png', // Fallback will trigger if needed
    rating: 4.9,
    reviews: 1420,
    address: 'Saket, Delhi NCR',
    distance: '1.2 km away',
    city: 'Delhi NCR',
    type: 'Multispeciality Surgical Hospital',
    phone: '+91-8877772277',
    hours: 'Open 24 hours',
    overview: 'Max Super Speciality Hospital in Saket is a premium surgical facility equipped with next-gen smart OTs, advanced intensive care units, and a dedicated international patient desk.',
    services: ['Cashless insurance', 'Modular OT', '24/7 support'],
    metrics: ['800+ Beds', 'NABH Accredited'],
    specialties: ['Orthopedics', 'Urology', 'General Surgery', 'Cardiology'],
    amenities: ['Insurance desk', 'Pharmacy', 'Diagnostics', 'Cab assistance'],
    map: { left: 35, top: 40, label: 'Saket' },
  },
  {
    slug: 'fortis-escorts-delhi',
    name: 'Fortis Escorts Heart Institute',
    image: 'https://www.fortishealthcare.com/drupal-data/styles/details_banner_1456_320/azblob/2023-05/Fortis%20Anandapur%20Hospital%20Banner.png?itok=qE249oYI',
    rating: 4.8,
    reviews: 1150,
    address: 'Okhla, Delhi NCR',
    distance: '3.4 km away',
    city: 'Delhi NCR',
    type: 'Advanced Surgery Centre',
    phone: '+91-8877772277',
    hours: 'Open 24 hours',
    overview: 'Fortis Escorts Heart Institute in Okhla is renowned for pioneering cardiac care, offering modern modular theatres, state-of-the-art diagnostic labs, and dedicated pre-post op recovery suites.',
    services: ['Free consultation', 'ICU support', 'Day-care surgery'],
    metrics: ['310+ Beds', 'JCI Accredited'],
    specialties: ['Cardiology', 'Laparoscopy', 'Orthopedics'],
    amenities: ['ICU backup', 'Cashless billing', 'Emergency care', 'Patient lounge'],
    map: { left: 55, top: 50, label: 'Okhla' },
  },
  // Bangalore Hospitals
  {
    slug: 'manipal-hospital-bangalore',
    name: 'Manipal Hospital',
    image: 'https://www.manipalhospitals.com/images/manipal-logo.png',
    rating: 4.9,
    reviews: 1680,
    address: 'HAL Road, Bangalore',
    distance: '2.0 km away',
    city: 'Bangalore',
    type: 'Multispeciality Surgical Hospital',
    phone: '+91-8877772277',
    hours: 'Open 24 hours',
    overview: 'Manipal Hospital on HAL Road is a leading healthcare destination in South India, offering comprehensive robotic-assisted surgeries, specialized care bays, and seamless insurance assistance.',
    services: ['Cashless insurance', 'Modular OT', '24/7 support'],
    metrics: ['600+ Beds', 'JCI Accredited'],
    specialties: ['Orthopedics', 'Urology', 'Laparoscopy', 'General Surgery'],
    amenities: ['Insurance desk', 'Pharmacy', 'Diagnostics', 'Cab assistance'],
    map: { left: 48, top: 38, label: 'HAL Road' },
  },
  {
    slug: 'aster-cmi-bangalore',
    name: 'Aster CMI Hospital',
    image: 'https://www.asterhospitals.in/themes/custom/aster/logo.svg',
    rating: 4.8,
    reviews: 950,
    address: 'Hebbal, Bangalore',
    distance: '4.5 km away',
    city: 'Bangalore',
    type: 'Advanced Surgery Centre',
    phone: '+91-8877772277',
    hours: 'Open 24 hours',
    overview: 'Aster CMI Hospital in Hebbal is an advanced multi-speciality facility featuring state-of-the-art diagnostic facilities, modular operation theatres, and round-the-clock emergency support services.',
    services: ['Free consultation', 'ICU support', 'Day-care surgery'],
    metrics: ['500+ Beds', 'NABH Accredited'],
    specialties: ['Cardiology', 'Gynaecology', 'Fertility', 'ENT'],
    amenities: ['ICU backup', 'Cashless billing', 'Emergency care', 'Patient lounge'],
    map: { left: 30, top: 20, label: 'Hebbal' },
  },
  // Mumbai Hospitals
  {
    slug: 'kokilaben-hospital-mumbai',
    name: 'Kokilaben Dhirubhai Ambani Hospital',
    image: 'https://www.kokilabenhospital.com/images/kda-logo.png',
    rating: 4.9,
    reviews: 2150,
    address: 'Andheri West, Mumbai',
    distance: '1.8 km away',
    city: 'Mumbai',
    type: 'Multispeciality Surgical Hospital',
    phone: '+91-8877772277',
    hours: 'Open 24 hours',
    overview: 'Kokilaben Dhirubhai Ambani Hospital in Andheri West is a landmark surgical facility with cutting-edge robotic surgical suites, a dedicated transplant wing, and massive intensive care infrastructure.',
    services: ['Cashless insurance', 'Modular OT', '24/7 support'],
    metrics: ['750+ Beds', 'JCI Accredited'],
    specialties: ['Orthopedics', 'Urology', 'Cardiology', 'General Surgery'],
    amenities: ['Insurance desk', 'Pharmacy', 'Diagnostics', 'Cab assistance'],
    map: { left: 25, top: 30, label: 'Andheri' },
  },
  {
    slug: 'nanavati-hospital-mumbai',
    name: 'Nanavati Max Super Speciality Hospital',
    image: 'https://www.nanavatimaxhospital.org/images/logo.png',
    rating: 4.7,
    reviews: 1320,
    address: 'Vile Parle, Mumbai',
    distance: '2.7 km away',
    city: 'Mumbai',
    type: 'Advanced Surgical Clinic',
    phone: '+91-8877772277',
    hours: 'Open 24 hours',
    overview: 'Nanavati Max Super Speciality Hospital in Vile Parle boasts a proud legacy of clinical excellence, modern laminar flow OTs, dedicated fertility chambers, and a comprehensive oncology unit.',
    services: ['Free consultation', 'ICU support', 'Day-care surgery'],
    metrics: ['350+ Beds', 'NABH Accredited'],
    specialties: ['Laparoscopy', 'Gynaecology', 'Fertility'],
    amenities: ['ICU backup', 'Cashless billing', 'Emergency care'],
    map: { left: 40, top: 45, label: 'Vile Parle' },
  }
];


// =====================================================
// TESTIMONIALS
// =====================================================
const TESTIMONIALS = [
  { initials: 'RK', name: 'Rajesh Kumar', treatment: 'Knee Replacement', rating: 5, text: 'The orthopedic team was exceptional. My knee replacement surgery went perfectly — I\'m walking pain-free after years of suffering. The robotic-assisted technique made recovery so much faster.' },
  { initials: 'SM', name: 'Sunita Mehra', treatment: 'Cataract Surgery', rating: 5, text: 'Had my cataract surgery done through Doctar. The entire process from booking to post-op care was seamless. I can see clearly now and the procedure was completely painless.' },
  { initials: 'AP', name: 'Arun Patel', treatment: 'Piles Treatment', rating: 5, text: 'Was suffering from piles for 3 years. The laser treatment was a game changer — no cuts, no pain, and I was back to work in 2 days. Highly recommend Doctar for proctology.' },
  { initials: 'NB', name: 'Neha Bansal', treatment: 'IVF Treatment', rating: 5, text: 'After 5 years of trying, Doctar\'s fertility team helped us conceive through IVF. The personalized protocol and emotional support made all the difference. Forever grateful!' },
  { initials: 'VT', name: 'Vikash Tiwari', treatment: 'Hair Transplant', rating: 4, text: 'Got FUE hair transplant through Doctar. Natural-looking results and the surgeon was very skilled. The team guided me through every step of the recovery process.' },
  { initials: 'PG', name: 'Priya Gupta', treatment: 'LASIK Surgery', rating: 5, text: 'Freedom from glasses after 15 years! The LASIK procedure took just 15 minutes and I could see clearly the very next day. Doctar made the entire experience stress-free.' },
];

// =====================================================
// TRUST BADGES (for hero section)
// =====================================================
const TRUST_BADGES = [
  { icon: '🛡️', title: 'USFDA Approved', subtitle: 'Procedures' },
  { icon: '🏥', title: '150+ Clinics', subtitle: 'Pan India' },
  { icon: '💳', title: 'No Cost EMI', subtitle: 'Easy Payment' },
  { icon: '🚕', title: 'Free Cab', subtitle: 'Home to Hospital' },
  { icon: '📋', title: 'Insurance Covered', subtitle: 'Top Providers' },
];

// =====================================================
// FAQ DATA (common + per category)
// =====================================================
const COMMON_FAQS = [
  { q: 'How do I book a surgery through Doctar?', a: 'You can book by calling our free helpline, filling the appointment form on our website, or clicking "Book Now" on any treatment page. Our care coordinator will guide you through the entire process.' },
  { q: 'Is the consultation free?', a: 'Yes, the initial consultation with our expert surgeons is completely free. You can discuss your condition, treatment options, and get a personalized care plan at no cost.' },
  { q: 'Do you accept health insurance?', a: 'Yes, we accept all major health insurance providers. Our dedicated insurance team handles all paperwork and claims processing, making it a cashless and hassle-free experience.' },
  { q: 'What is the No Cost EMI option?', a: 'We offer No Cost EMI plans starting from ₹0 down payment. You can spread your surgery cost over 3 to 24 months with zero interest through our banking partners.' },
  { q: 'Do you provide cab service?', a: 'Yes, we provide free cab pick-up and drop service from your home to the hospital and back on the day of surgery.' },
  { q: 'How experienced are the surgeons?', a: 'All our surgeons are board-certified with a minimum of 10 years of experience. They are trained in the latest minimally invasive and laser techniques.' },
];

// Helper: find treatment across all categories
function findTreatment(slug) {
  for (const catSlug in TREATMENTS) {
    const t = TREATMENTS[catSlug].find(t => t.slug === slug);
    if (t) return { ...t, categorySlug: catSlug };
  }
  return null;
}

// Helper: find category by slug
function findCategory(slug) {
  return CATEGORIES.find(c => c.slug === slug);
}

// Helper: get doctors for a category
function getDoctorsForCategory(catSlug) {
  return DOCTORS.filter(d => d.categories.includes(catSlug));
}

// Helper: find hospital by slug
function findHospital(slug) {
  return HOSPITALS.find(h => h.slug === slug);
}
