import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { company } from '../data/content'
const links = [['/', 'Home'], ['/about', 'About'], ['/services', 'Services'], ['/projects', 'Projects'], ['/contact', 'Contact']]
const descriptions = { '/': 'Land preparation for greater possibilities. Explore CORD Mobilizer and start a conversation about your development project.', '/about': 'Meet CORD Mobilizer and explore our approach to land preparation and development.', '/services': 'Explore illustrative land clearing, site preparation, earthmoving, and development services.', '/projects': 'Explore a demonstration gallery of land mobilization and site preparation imagery.', '/contact': 'Send CORD Mobilizer an inquiry about your land preparation project.' }
export default function Layout({ children }) {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    const page = links.find(([path]) => path === pathname)?.[1] || 'Page Not Found'
    document.title = `${page} | CORD Mobilizer`
    const description = descriptions[pathname] || 'This CORD Mobilizer page could not be found.'
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description)
  }, [pathname])
  return <><a className="skip-link" href="#main">Skip to content</a><header><div className="container header-inner"><Link to="/" className="brand" aria-label="CORD Mobilizer home"><img src={company.logo} alt="CORD Mobilizer official logo" /><span><strong>CORD</strong><small>MOBILIZER</small></span></Link><button className="menu-toggle" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button><nav id="navigation" className={open ? 'open' : ''} aria-label="Main navigation">{links.map(([path, name]) => <NavLink key={path} to={path} end={path === '/'} onClick={() => setOpen(false)}>{name}</NavLink>)}<Link className="button nav-inquiry" to="/contact" onClick={() => setOpen(false)}>Send an Inquiry<ArrowUpRight size={16} /></Link></nav></div></header><main id="main" tabIndex={-1}>{children}</main><footer><div className="container footer-grid"><div><Link to="/" className="footer-brand">CORD<span>MOBILIZER</span></Link><p>{company.tagline}</p><p>Preparing the ground.<br />Opening new possibilities.</p></div><div><h3>Explore</h3>{links.map(([path, name]) => <Link key={path} to={path}>{name}</Link>)}</div><div><h3>Let’s talk about your project</h3><p>Share your requirements through our inquiry form.</p><Link className="footer-contact" to="/contact">Get in touch <ArrowUpRight size={17} /></Link><small>Business contact details to be confirmed.</small></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} CORD Mobilizer. All rights reserved.</span><span>Built on trust. Grounded in possibility.</span></div></footer></>
}
