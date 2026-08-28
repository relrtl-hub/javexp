import { useEffect, useMemo, useState } from 'react'
import { categories, findSubject, subjects, subjectsForCategory, type Subject } from './data'
import './styles.css'

type Route = { slug: string | null; categoryId: string | null }

function readRoute(): Route {
  const hash = window.location.hash.replace(/^#\/?/, '')
  if (hash.startsWith('category/')) return { slug: null, categoryId: hash.slice('category/'.length) || null }
  return { slug: hash || null, categoryId: null }
}

function App() {
  const [route, setRoute] = useState<Route>(readRoute)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const onHashChange = () => setRoute(readRoute())
    const onPopState = () => setRoute(readRoute())
    window.addEventListener('hashchange', onHashChange)
    window.addEventListener('popstate', onPopState)
    return () => {
      window.removeEventListener('hashchange', onHashChange)
      window.removeEventListener('popstate', onPopState)
    }
  }, [])

  const currentSubject = route.slug ? findSubject(route.slug) : undefined
  const visibleSubjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return subjects.filter((subject) => {
      const searchable = [subject.title, subject.summary, subject.category, ...subject.tags].join(' ').toLowerCase()
      return !normalizedQuery || searchable.includes(normalizedQuery)
    })
  }, [query])

  const navigate = (slug: string | null) => {
    window.history.pushState({}, '', slug ? `#${slug}` : window.location.pathname)
    setRoute({ slug, categoryId: null })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const navigateCategory = (categoryId: string) => {
    window.history.pushState({}, '', `#category/${categoryId}`)
    setRoute({ slug: null, categoryId })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openSubject = (subject: Subject) => {
    navigate(subject.slug)
  }

  const goHome = () => {
    navigate(null)
  }

  return (
    <div className="site-shell">
      <header className="mobile-header">
        <button className="brand-button" onClick={goHome} type="button">
          <span className="brand-mark">J</span>
          <span>Java Atlas</span>
        </button>
        <span className="mobile-count">{subjects.length} subjects</span>
      </header>

      <aside className="sidebar">
        <button className="brand-lockup" onClick={goHome} type="button">
          <span className="brand-mark">J</span>
          <span>
            <strong>Java Atlas</strong>
            <small>Practical engineering notes</small>
          </span>
        </button>

        <div className="sidebar-rule" />
        <p className="nav-label">Explore</p>
        <nav className="sidebar-nav" aria-label="Main navigation">
          <button className={!route.slug && !route.categoryId ? 'nav-link active' : 'nav-link'} onClick={() => { setQuery(''); goHome() }} type="button">
            <span>⌂</span> Overview
          </button>
          <button className={route.categoryId === 'backend-tools' ? 'nav-link active' : 'nav-link'} onClick={() => navigateCategory('backend-tools')} type="button">
            <span>◈</span> Backend tools
          </button>
          <button className={route.categoryId === 'system-design' ? 'nav-link active' : 'nav-link'} onClick={() => navigateCategory('system-design')} type="button">
            <span>⊞</span> System design
          </button>
        </nav>

        <p className="nav-label category-label">Categories</p>
        <nav className="category-nav" aria-label="Subject categories">
          {categories.map((category) => (
            <button className={route.categoryId === category.id || currentSubject?.category === category.id ? 'category-link active' : 'category-link'} key={category.id} onClick={() => navigateCategory(category.id)} type="button">
              <span>{category.label}</span>
              <small>{subjectsForCategory(category.id).length}</small>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <span className="status-dot" />
          <span>Small examples. Real tradeoffs.</span>
        </div>
      </aside>

      <main className="main-content">
        <div className="topbar">
          <div className="breadcrumb"><button onClick={goHome} type="button">Java Atlas</button>{(currentSubject || route.categoryId) && <><span>/</span><button onClick={() => currentSubject ? navigateCategory(currentSubject.category) : undefined} type="button">{currentSubject ? categories.find((category) => category.id === currentSubject.category)?.label : categories.find((category) => category.id === route.categoryId)?.label}</button></>}{currentSubject && <><span>/</span><span>{currentSubject.title}</span></>}</div>
          <div className="topbar-note">Java 21 · field guide</div>
        </div>

        {currentSubject ? (
          <SubjectPage subject={currentSubject} onNavigateCategory={navigateCategory} onOpenSubject={openSubject} />
        ) : route.categoryId ? (
          <CategoryPage categoryId={route.categoryId} onOpenSubject={openSubject} onNavigateCategory={navigateCategory} />
        ) : (
          <HomePage
            onOpenSubject={openSubject}
            onSearch={setQuery}
            query={query}
            subjects={visibleSubjects}
          />
        )}
      </main>
    </div>
  )
}

type HomePageProps = {
  onOpenSubject: (subject: Subject) => void
  onSearch: (query: string) => void
  query: string
  subjects: Subject[]
}

function HomePage({ onOpenSubject, onSearch, query, subjects: visibleSubjects }: HomePageProps) {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">A working reference for Java engineers</p>
          <h1>Understand the shape of the thing.</h1>
          <p className="hero-summary">Short explanations, minimal Java, and the tradeoffs that tutorials usually hide in footnotes.</p>
        </div>
        <div className="hero-stamp">
          <span>01</span>
          <small>BUILD<br />THE<br />MENTAL<br />MODEL</small>
        </div>
      </section>

      <section className="search-panel" aria-label="Search subjects">
        <span className="search-icon">⌕</span>
        <input aria-label="Search subjects" onChange={(event) => onSearch(event.target.value)} placeholder="Search concepts, patterns, algorithms, tools..." value={query} />
        <kbd>⌘ K</kbd>
      </section>

      <section className="intro-row">
        <div>
          <p className="eyebrow">The first pass</p>
          <h2>{query ? 'Search the atlas' : 'Start anywhere, go deeper'}</h2>
        </div>
        <p>{query ? `Showing ${visibleSubjects.length} matching subjects.` : 'Every page answers one practical question. No Java basics tour, no ceremonial definitions, no 70-slide preamble.'}</p>
      </section>

      {!query && <CategoryDirectory onOpenSubject={onOpenSubject} />}

      <section className="catalog" id="catalog">
        <div className="section-heading">
          <span>{query ? 'Search results' : 'All subjects'}</span>
          <small>{visibleSubjects.length} indexed</small>
        </div>
        {visibleSubjects.length > 0 ? (
          <div className="subject-grid">
            {visibleSubjects.map((subject, index) => <SubjectCard index={index} key={subject.slug} onOpen={onOpenSubject} subject={subject} />)}
          </div>
        ) : (
          <div className="empty-state"><strong>No subject found.</strong><span>Try a broader search. The index is still small, not magical.</span></div>
        )}
      </section>

      <section className="paths-section">
        <div className="section-heading"><span>Suggested paths</span><small>Read in order, or ignore us productively.</small></div>
        <div className="path-grid">
          <PathCard number="01" title="Build reliable services" subjects={['equals-and-hashcode', 'redis', 'rate-limiter']} onOpenSubject={onOpenSubject} />
          <PathCard number="02" title="Think in structures" subjects={['tree-traversal', 'binary-search-tree', 'lru-cache']} onOpenSubject={onOpenSubject} />
          <PathCard number="03" title="Survive production" subjects={['race-condition', 'kafka', 'circuit-breaker']} onOpenSubject={onOpenSubject} />
        </div>
      </section>

      <footer className="site-footer"><span>Java Atlas / v0.1</span><span>Built for understanding, not collecting tabs.</span></footer>
    </>
  )
}

function CategoryDirectory({ onOpenSubject }: { onOpenSubject: (subject: Subject) => void }) {
  return (
    <section className="category-directory">
      <div className="section-heading"><span>Browse by category</span><small>9 areas · 2 subjects each</small></div>
      <div className="category-directory-list">
        {categories.map((category, index) => {
          const categorySubjects = subjectsForCategory(category.id)
          return (
            <article className="category-row" key={category.id}>
              <a className="category-row-main" href={`#category/${category.id}`}>
                <span className="category-index">{String(index + 1).padStart(2, '0')}</span>
                <span><strong>{category.label}</strong><small>{category.description}</small></span>
                <span className="category-count">{categorySubjects.length}</span>
                <span className="category-arrow">↗</span>
              </a>
              <div className="category-subjects">
                {categorySubjects.map((subject) => <button key={subject.slug} onClick={() => onOpenSubject(subject)} type="button">{subject.title}<span>↗</span></button>)}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

function CategoryPage({ categoryId, onNavigateCategory, onOpenSubject }: { categoryId: string; onNavigateCategory: (categoryId: string) => void; onOpenSubject: (subject: Subject) => void }) {
  const category = categories.find((item) => item.id === categoryId)
  const categorySubjects = subjectsForCategory(categoryId)
  if (!category) return <div className="empty-state"><strong>Category not found.</strong><button onClick={() => onNavigateCategory('java-runtime')} type="button">Open Java runtime</button></div>
  return (
    <article className="category-page">
      <header className="category-page-header">
        <p className="eyebrow">Category / {String(categories.findIndex((item) => item.id === categoryId) + 1).padStart(2, '0')}</p>
        <h1>{category.label}</h1>
        <p>{category.description} This category currently has {categorySubjects.length} focused subjects.</p>
      </header>
      <div className="category-page-bar"><span>{categorySubjects.length} subjects in this category</span><button onClick={() => onNavigateCategory('java-runtime')} type="button">Jump to Java runtime ↗</button></div>
      <div className="subject-grid category-subject-grid">{categorySubjects.map((subject, index) => <SubjectCard index={index} key={subject.slug} onOpen={onOpenSubject} subject={subject} />)}</div>
      <div className="category-next"><span>More subjects will land here.</span><span>Same structure, more depth.</span></div>
    </article>
  )
}

function SubjectCard({ index, onOpen, subject }: { index: number; onOpen: (subject: Subject) => void; subject: Subject }) {
  const category = categories.find((item) => item.id === subject.category)
  return (
    <button className="subject-card" onClick={() => onOpen(subject)} type="button">
      <span className="card-number">{String(index + 1).padStart(2, '0')}</span>
      <span className="card-category">{category?.label}</span>
      <strong>{subject.title}</strong>
      <span className="card-summary">{subject.summary}</span>
      <span className="card-meta"><span>{subject.level}</span><span>{subject.minutes} min</span><span className="card-arrow">↗</span></span>
    </button>
  )
}

function PathCard({ number, onOpenSubject, subjects: slugs, title }: { number: string; onOpenSubject: (subject: Subject) => void; subjects: string[]; title: string }) {
  return (
    <article className="path-card">
      <span className="path-number">{number}</span>
      <h3>{title}</h3>
      <div className="path-list">
        {slugs.map((slug) => {
          const subject = findSubject(slug)
          return subject ? <button key={subject.slug} onClick={() => onOpenSubject(subject)} type="button">{subject.title}<span>↗</span></button> : null
        })}
      </div>
    </article>
  )
}

function SubjectPage({ onNavigateCategory, onOpenSubject, subject }: { onNavigateCategory: (categoryId: string) => void; onOpenSubject: (subject: Subject) => void; subject: Subject }) {
  const category = categories.find((item) => item.id === subject.category)
  const categorySubjects = subjectsForCategory(subject.category)
  const currentIndex = categorySubjects.findIndex((item) => item.slug === subject.slug)
  const previousSubject = currentIndex > 0 ? categorySubjects[currentIndex - 1] : undefined
  const nextSubject = currentIndex < categorySubjects.length - 1 ? categorySubjects[currentIndex + 1] : undefined
  const relatedSubjects = categorySubjects.filter((item) => item.slug !== subject.slug).slice(0, 3)
  return (
    <article className="subject-page">
      <header className="subject-header">
        <div>
          <p className="eyebrow">{category?.label} / {subject.level}</p>
          <h1>{subject.title}</h1>
          <p className="subject-summary">{subject.summary}</p>
        </div>
        <div className="subject-facts"><span><strong>{subject.minutes}</strong> min read</span><span><strong>Java</strong> {subject.level}</span></div>
      </header>

      <div className="tag-row">{subject.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div>

      <div className="article-layout">
        <div className="article-main">
          <aside className="takeaway" id="core-idea"><span>Core idea</span><strong>{subject.takeaway}</strong></aside>
          {subject.diagram && <Diagram items={subject.diagram} />}
          <CodeBlock label={subject.codeLabel} note={subject.codeNote} code={subject.code} />
          {subject.sections.map((section) => (
            <section className="article-section" id={section.heading.toLowerCase().replaceAll(' ', '-')} key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
            </section>
          ))}
        </div>
        <aside className="article-aside">
          <div className="aside-block"><span className="aside-label">On this page</span><a href="#core-idea">Core idea</a><a href="#example">Minimal example</a>{subject.sections.map((section) => <a href={`#${section.heading.toLowerCase().replaceAll(' ', '-')}`} key={section.heading}>{section.heading}</a>)}</div>
          <div className="aside-block related-block"><span className="aside-label">Keep going</span>{relatedSubjects.map((related) => <button key={related.slug} onClick={() => onOpenSubject(related)} type="button"><span>{related.title}</span><small>↗</small></button>)}</div>
        </aside>
      </div>
      <nav className="subject-pager" aria-label="Subject navigation">
        {previousSubject ? <button onClick={() => onOpenSubject(previousSubject)} type="button"><small>← Previous in {category?.label}</small><strong>{previousSubject.title}</strong></button> : <button onClick={() => onNavigateCategory(subject.category)} type="button"><small>← Back to category</small><strong>{category?.label}</strong></button>}
        {nextSubject && <button onClick={() => onOpenSubject(nextSubject)} type="button"><small>Next in {category?.label} →</small><strong>{nextSubject.title}</strong></button>}
      </nav>
    </article>
  )
}

function Diagram({ items }: { items: string[] }) {
  return <div className="diagram" aria-label="Concept flow">{items.map((item, index) => <span className="diagram-step" key={item}><b>{String(index + 1).padStart(2, '0')}</b>{item}{index < items.length - 1 && <i>→</i>}</span>)}</div>
}

function CodeBlock({ code, label, note }: { code: string; label: string; note: string }) {
  const copyCode = async () => {
    await navigator.clipboard?.writeText(code)
  }
  return (
    <section className="code-section" id="example">
      <div className="code-heading"><span>Minimal example</span><button onClick={copyCode} type="button">Copy code</button></div>
      <div className="code-frame"><div className="code-bar"><span className="code-dots"><i /><i /><i /></span><span>{label}</span><span>Java 21</span></div><pre><code>{code}</code></pre></div>
      <p className="code-note">{note}</p>
    </section>
  )
}

export default App
