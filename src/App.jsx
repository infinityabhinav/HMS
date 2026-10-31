import { useEffect, useState } from 'react'
import {
  ArrowDown,
  ArrowRight,
  Check,
  ChevronDown,
  CircleCheck,
  Droplets,
  Leaf,
  Menu,
  Moon,
  ShieldCheck,
  Sparkles,
  Sprout,
  X,
} from 'lucide-react'
import { PAYMENT_LINK } from './config.js'

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About the Guide', href: '#about' },
]

const topics = [
  {
    number: '01',
    title: 'Everyday hair-care habits',
    description: 'Gentle hair care, better sleep, hydration and balanced nutrition—small habits that fit real life.',
    icon: Moon,
  },
  {
    number: '02',
    title: 'Traditional herbal practices',
    description: 'An introduction to traditional ingredients including amla, rosemary, neem, fenugreek and kalonji.',
    icon: Sprout,
  },
  {
    number: '03',
    title: 'A happier, healthier scalp',
    description: 'Understand cleansing, dandruff and irritation, with practical basics for a considered scalp routine.',
    icon: Droplets,
  },
  {
    number: '04',
    title: 'A 90-day hair-care tracker',
    description: 'Make space to notice your habits, observe changes and build a routine you can keep up with.',
    icon: CircleCheck,
  },
]

const included = [
  'A detailed hair-care eBook',
  'Practical lifestyle guidance',
  'Traditional herbal-care information',
  'Scalp-care guidance',
  'Printable 90-day tracker',
  'Hair-care checklists',
  'Educational illustrations',
]

const questions = [
  {
    question: 'What will I receive?',
    answer: 'You will receive a digital PDF eBook containing hair-care guidance, traditional herbal practices, scalp-care information and a 90-day tracker.',
  },
  {
    question: 'How much does it cost?',
    answer: 'The guide costs ₹9 as a one-time digital purchase.',
  },
  {
    question: 'How will I receive the PDF?',
    answer: 'After successful payment, the digital product will be made available through the configured download process.',
  },
  {
    question: 'Can this guide guarantee hair fall control?',
    answer: 'No. Hair fall can have different causes, and results vary. The guide is educational and does not replace professional medical advice.',
  },
  {
    question: 'Is this a physical product?',
    answer: 'No. This is a digital PDF eBook. No physical product will be shipped.',
  },
]

const policies = {
  'About the Guide': 'The Hair Fall Control Guide is a digital, educational resource about everyday hair-care habits, scalp health, traditional herbal practices and routine tracking.',
  'Contact Us': 'Add your customer-support email address here before launch so buyers know how to reach you with questions about their order.',
  'Privacy Policy': 'Add your business contact details and final privacy policy before launch. If you later connect a payment provider or analytics service, explain what information those services collect and link to their policies.',
  'Terms and Conditions': 'This is a digital educational product. Add your seller details, delivery terms, permitted use and any other terms that apply to your business before launch.',
  'Refund Policy': 'Add your refund and cancellation terms before launch. Make sure they are clear to buyers before they complete a purchase.',
  'Medical Disclaimer': 'This guide is for general educational purposes only. It is not medical advice, diagnosis or treatment. Hair fall can have many causes; consult a qualified healthcare professional about persistent or concerning symptoms.',
}

function BrandMark({ compact = false }) {
  return (
    <a className={`brand ${compact ? 'brand--footer' : ''}`} href="#home" aria-label="HairCare Guide home">
      <span className="brand-icon" aria-hidden="true"><Leaf size={18} strokeWidth={1.7} /></span>
      <span>haircare<span className="brand-light">guide</span></span>
    </a>
  )
}

function BotanicalArtwork() {
  return (
    <svg className="botanical-art" viewBox="0 0 320 275" fill="none" role="img" aria-label="Botanical illustration of leafy branches and amla fruit">
      <path d="M50 255C111 200 149 140 186 43M87 223C113 210 139 205 159 204M120 175C95 162 75 146 63 124M144 139C172 139 194 132 213 116M165 98C145 82 135 64 131 45M179 64C203 57 219 43 229 25" stroke="#496B50" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M112 212C92 202 83 186 84 167C104 172 116 186 112 212ZM142 202C155 182 173 175 192 179C181 196 165 204 142 202ZM81 158C62 147 55 131 59 113C78 120 87 135 81 158ZM185 130C198 111 215 105 233 109C221 125 205 133 185 130ZM130 85C111 72 104 57 109 40C127 49 135 65 130 85ZM199 66C213 48 230 42 247 47C234 62 218 69 199 66Z" fill="#A8B9A0" stroke="#496B50" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M112 212C107 192 97 179 84 167M142 202C157 189 174 181 192 179M81 158C76 140 69 125 59 113M185 130C200 118 217 111 233 109M130 85C125 68 117 52 109 40M199 66C214 54 232 48 247 47" stroke="#496B50" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M171 229C192 213 207 195 215 175" stroke="#8C7653" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="199" cy="191" r="9" fill="#BD9070" /><circle cx="217" cy="179" r="8" fill="#C8A17C" /><circle cx="189" cy="210" r="7" fill="#C8A17C" />
      <path d="M33 255h82" stroke="#D8CBB5" strokeWidth="1" />
      <text x="34" y="270" fill="#8C7653" fontFamily="DM Sans, sans-serif" fontSize="8" letterSpacing="2.4">AMLA · ROSEMARY · CARE</text>
    </svg>
  )
}

function BookMockup() {
  return (
    <div className="book-scene" aria-label="The Hair Fall Control Guide eBook cover mockup">
      <div className="book-shadow" />
      <div className="book">
        <div className="book-spine" />
        <div className="book-cover">
          <div className="cover-topline"><span>HAIRCARE GUIDE</span><span>VOL. 01</span></div>
          <div className="cover-rule" />
          <p className="cover-kicker">A GENTLER APPROACH TO</p>
          <h2>THE HAIR<br />FALL CONTROL<br /><em>GUIDE</em></h2>
          <p className="cover-subtitle">A 90-Day Journey to<br />Healthier Hair</p>
          <BotanicalArtwork />
          <div className="cover-footer"><span>CARE, ROOTED IN ROUTINE</span><span>2026</span></div>
        </div>
      </div>
      <div className="book-caption"><span className="caption-dot" /> A thoughtful guide, made for everyday life</div>
    </div>
  )
}

function PreviewSpread() {
  return (
    <div className="preview-stage" aria-label="Illustrative preview of sample eBook pages">
      <div className="preview-note"><Sparkles size={14} /> SAMPLE PAGE LAYOUTS</div>
      <div className="paper paper--back">
        <span className="paper-label">CHAPTER 02</span>
        <span className="paper-heading">A calmer scalp<br />starts with care</span>
        <span className="paper-copy">A few mindful steps can help you get to know your scalp and create a routine that feels comfortable.</span>
        <span className="paper-art"><Leaf size={30} /></span>
        <span className="paper-lines"><i /><i /><i /><i /></span>
        <span className="paper-page">08</span>
      </div>
      <div className="paper paper--front">
        <span className="paper-label">YOUR 90-DAY PRACTICE</span>
        <span className="paper-heading">Small steps,<br />noticed over time.</span>
        <span className="paper-copy">A simple tracker for routines, observations and the habits you want to build.</span>
        <span className="tracker-grid" aria-hidden="true">{Array.from({ length: 28 }, (_, index) => <i key={index} />)}</span>
        <span className="paper-footer">WEEK ONE <span>01 — 07</span></span>
      </div>
      <div className="preview-caption"><span>Designed to read at your own pace.</span><span>PDF · PRINTABLE PAGES</span></div>
    </div>
  )
}

function FAQItem({ question, answer, open, onClick, index }) {
  return (
    <div className={`faq-item ${open ? 'faq-item--open' : ''}`}>
      <button className="faq-question" type="button" aria-expanded={open} onClick={onClick}>
        <span className="faq-index">0{index + 1}</span>
        <span>{question}</span>
        <ChevronDown className="faq-chevron" size={18} />
      </button>
      <div className="faq-answer" hidden={!open}><p>{answer}</p></div>
    </div>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState(0)
  const [activePolicy, setActivePolicy] = useState('')
  const paymentConfigured = /^https:\/\//i.test(PAYMENT_LINK)

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === 'Escape') {
        setActivePolicy('')
        setMenuOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <BrandMark />
          <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
          <nav className={`main-nav ${menuOpen ? 'main-nav--open' : ''}`} aria-label="Main navigation">
            {navLinks.map((link) => <a key={link.href} href={link.href} onClick={closeMenu}>{link.label}</a>)}
            <a className="nav-buy" href="#pricing" onClick={closeMenu}>Get the guide <ArrowRight size={15} /></a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero section-shell" id="home">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-leaf"><Leaf size={13} /></span> DIGITAL HAIR-CARE GUIDE</div>
            <h1>Understand your hair.<br /><span>Build a better</span><br /><em>hair-care routine.</em></h1>
            <p className="hero-description">Practical hair-care habits, scalp guidance, traditional herbal practices and a simple 90-day tracker—in one thoughtful guide.</p>
            <div className="hero-purchase-row">
              <div className="hero-price"><span>JUST</span><strong>₹9</strong><span>ONE TIME</span></div>
              <span className="hero-price-divider" />
              <a className="hero-cta" href="#pricing">Get your guide <span>— ₹9</span><ArrowRight size={17} /></a>
            </div>
            <div className="hero-assurance"><ShieldCheck size={15} strokeWidth={1.8} /><span>Digital PDF <i /> Instant download after purchase</span></div>
            <a className="hero-scroll" href="#about"><span>Explore the guide</span><ArrowDown size={14} /></a>
          </div>
          <div className="hero-visual">
            <div className="visual-orbit visual-orbit--one" /><div className="visual-orbit visual-orbit--two" />
            <span className="visual-stamp">GROW<br />GENTLY</span>
            <BookMockup />
          </div>
          <div className="hero-note"><span>01</span> A more considered way to care</div>
        </section>

        <section className="intro-band" aria-label="Guide approach">
          <div className="intro-inner">
            <p><span>Less overwhelm.</span> More understanding, steady habits and room to notice what works for you.</p>
            <div className="intro-seal"><Sprout size={17} /><span>GROUNDED IN<br />EVERYDAY CARE</span></div>
          </div>
        </section>

        <section className="about section-shell section-pad" id="about">
          <div className="section-heading">
            <div><div className="section-kicker">A GUIDE YOU CAN GROW WITH</div><h2>Everything you need to build<br /><em>a better hair-care routine.</em></h2></div>
            <p>A clear, approachable starting point for learning about your hair and caring for it with a little more intention.</p>
          </div>
          <div className="topic-grid">
            {topics.map(({ number, title, description, icon: Icon }) => (
              <article className="topic-card" key={number}>
                <div className="topic-card-top"><span className="topic-icon"><Icon size={21} strokeWidth={1.55} /></span><span className="topic-number">{number}</span></div>
                <h3>{title}</h3><p>{description}</p><span className="topic-line" />
              </article>
            ))}
          </div>
        </section>

        <section className="included-section section-pad" id="inside">
          <div className="included-inner section-shell">
            <div className="included-copy">
              <div className="section-kicker section-kicker--light">MADE TO BE USEFUL</div>
              <h2>Your digital guide<br /><em>includes.</em></h2>
              <p>Easy-to-follow information and useful pages you can return to as your routine takes shape.</p>
              <ul className="included-list">{included.map((item) => <li key={item}><span><Check size={13} /></span>{item}</li>)}</ul>
              <a className="text-link text-link--light" href="#pricing">See the guide <ArrowRight size={15} /></a>
            </div>
            <PreviewSpread />
          </div>
          <div className="included-decoration" aria-hidden="true"><Leaf size={180} strokeWidth={0.5} /></div>
        </section>

        <section className="pricing-section section-pad" id="pricing">
          <div className="pricing-header"><div className="section-kicker">A SMALL STEP TOWARD A BETTER ROUTINE</div><h2>Good care begins<br /><em>with understanding.</em></h2></div>
          <div className="pricing-layout section-shell">
            <div className="pricing-note"><span className="quote-mark">“</span><p>Make room for simple habits, learn as you go, and find a routine that feels like yours.</p><span className="note-signature"><Leaf size={14} /> THE HAIRCARE GUIDE</span></div>
            <article className="price-card">
              <div className="price-card-top"><span className="price-tag"><Sparkles size={13} /> THE COMPLETE GUIDE</span><span className="price-edition">DIGITAL EDITION</span></div>
              <h3>The Hair Fall<br />Control Guide</h3>
              <p className="price-subtitle">A Practical Guide to Better Hair-Care Habits, Scalp Health &amp; Traditional Herbal Practices</p>
              <div className="price-rule" />
              <div className="price-amount"><span>₹</span>9<small>one-time payment</small></div>
              {paymentConfigured ? (
                <a className="buy-button" href={PAYMENT_LINK}>Buy now — ₹9 <ArrowRight size={17} /></a>
              ) : (
                <button className="buy-button buy-button--disabled" type="button" disabled aria-describedby="payment-config-note">Buy now — ₹9 <ArrowRight size={17} /></button>
              )}
              {!paymentConfigured && <p className="payment-config-note" id="payment-config-note">Add your PhonePe link in <code>src/config.js</code> to enable checkout.</p>}
              <div className="price-assurance"><ShieldCheck size={16} /><span>One-time payment</span><i /><span>Digital PDF</span></div>
              <p className="physical-note">Digital product. No physical delivery.</p>
            </article>
          </div>
          <div className="pricing-bottom-note"><span className="tiny-star">✳</span> A resource to support your routine—not a promise of a particular result.</div>
        </section>

        <section className="faq-section section-pad" id="faq">
          <div className="faq-layout section-shell">
            <div className="faq-heading"><div className="section-kicker">A FEW HELPFUL DETAILS</div><h2>Questions,<br /><em>answered.</em></h2><p>Everything you need to know before choosing your guide.</p><div className="faq-flower" aria-hidden="true"><Sprout size={84} strokeWidth={0.8} /></div></div>
            <div className="faq-list">{questions.map(({ question, answer }, index) => <FAQItem key={question} index={index} question={question} answer={answer} open={openFaq === index} onClick={() => setOpenFaq(openFaq === index ? -1 : index)} />)}</div>
          </div>
        </section>

        <section className="closing-note">
          <div className="closing-mark"><Leaf size={19} /></div>
          <p>Every routine starts somewhere.<br /><em>Start with a little more understanding.</em></p>
          <a href="#pricing" aria-label="Get the guide for ₹9"><ArrowRight size={18} /></a>
        </section>
      </main>

      <footer className="site-footer" id="contact">
        <div className="footer-main section-shell">
          <div className="footer-brand-block"><BrandMark compact /><p>Care, rooted in routine.<br />A thoughtful guide to better hair-care habits.</p></div>
          <div className="footer-links"><span className="footer-label">EXPLORE</span><a href="#about">About the Guide</a><a href="#inside">What’s inside</a><a href="#faq">FAQs</a></div>
          <div className="footer-links"><span className="footer-label">INFORMATION</span>{['Contact Us', 'Privacy Policy', 'Terms and Conditions', 'Refund Policy', 'Medical Disclaimer'].map((label) => <button key={label} type="button" onClick={() => setActivePolicy(label)}>{label}</button>)}</div>
          <div className="footer-signoff"><span className="footer-seal"><Leaf size={21} /></span><span>TAKE CARE,<br />GROW GENTLY.</span></div>
        </div>
        <div className="footer-bottom section-shell"><span>© 2026 HairCare Guide. All rights reserved.</span><span>Made for a more mindful routine <Leaf size={12} /></span></div>
      </footer>

      {activePolicy && <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setActivePolicy('') }}>
        <section className="policy-dialog" role="dialog" aria-modal="true" aria-labelledby="policy-title">
          <button className="dialog-close" type="button" aria-label="Close dialog" onClick={() => setActivePolicy('')}><X size={20} /></button>
          <span className="section-kicker">HAIRCARE GUIDE</span><h2 id="policy-title">{activePolicy}</h2><p>{policies[activePolicy]}</p>
          <button className="dialog-done" type="button" onClick={() => setActivePolicy('')}>Close <Check size={15} /></button>
        </section>
      </div>}
    </>
  )
}

export default App
