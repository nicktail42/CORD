import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import { Home, About, Services, Projects, Contact, NotFound } from './pages/Pages'
import './App.css'
export default function App() {
  return <BrowserRouter><Layout><Routes><Route path="/" element={<Home />} /><Route path="/about" element={<About />} /><Route path="/services" element={<Services />} /><Route path="/projects" element={<Projects />} /><Route path="/contact" element={<Contact />} /><Route path="*" element={<NotFound />} /></Routes></Layout></BrowserRouter>
}
