import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import { GuideArticle, GuidesIndex } from './pages/Guides.jsx'
import { About, Contact, Privacy, Terms } from './pages/Static.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="guides" element={<GuidesIndex />} />
        <Route path="guides/:slug" element={<GuideArticle />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="privacy-policy" element={<Privacy />} />
        <Route path="terms" element={<Terms />} />
      </Route>
      <Route element={<Layout noindex />}>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
