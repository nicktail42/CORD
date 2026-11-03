import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { company } from '../data/content'
const links = [['/', 'Home'], ['/about', 'About'], ['/services', 'Services'], ['/projects', 'Projects'], ['/contact', 'Contact']]
const descriptions = { '/': company.summary, '/about': `${company.name}: community organizing, CMP mobilization, and leadership formation in support of Informal Settler Families.`, '/services': `Explore proposed community organizing, CMP mobilization, housing assistance and coordination, and leadership formation services from ${company.name}.`, '/projects': `Explore illustrative community and housing concepts from ${company.name}. Gallery visuals are not verified CORD projects.`, '/contact': `Contact ${company.name} about your community’s housing and coordination needs.` }
export default function Layout({ children }) {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    const page = links.find(([path]) => path === pathname)?.[1] || 'Page Not Found'
    document.title = `${page} | ${company.name}`
    const description = descriptions[pathname] || `This ${company.name} page could not be found.`
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description)
  }, [pathname])
  return <><a className="skip-link" href="#main">Skip to content</a><header><div className="container header-inner"><Link to="/" className="brand" aria-label={`${company.name} home`}><img src={company.logo} alt={`${company.name} official logo`} /><span><strong>CORD</strong><small>COMMUNITY ORGANIZER</small></span></Link><button className="menu-toggle" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button><nav id="navigation" className={open ? 'open' : ''} aria-label="Main navigation">{links.map(([path, name]) => <NavLink key={path} to={path} end={path === '/'} onClick={() => setOpen(false)}>{name}</NavLink>)}<Link className="button nav-inquiry" to="/contact" onClick={() => setOpen(false)}>Send an Inquiry<ArrowUpRight size={16} /></Link></nav></div></header><main id="main" tabIndex={-1}>{children}</main><footer><div className="container footer-grid"><div><Link to="/" className="footer-brand">CORD<span>COMMUNITY ORGANIZER</span></Link><p>{company.tagline}</p><p>Official organization: {company.legalName}</p><p>Community organizing. Housing coordination.<br />Leadership formation.</p></div><div><h3>Explore</h3>{links.map(([path, name]) => <Link key={path} to={path}>{name}</Link>)}</div><div><h3>Let’s talk about your community</h3><p>Share your requirements through our inquiry form.</p><Link className="footer-contact" to="/contact">Get in touch <ArrowUpRight size={17} /></Link><small>Business contact details to be confirmed.</small></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} {company.legalName} All rights reserved.</span><span>Built on trust. Grounded in possibility.</span></div></footer></>
}
