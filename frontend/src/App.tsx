import { BrowserRouter, Routes, Route } from 'react-router-dom'
import IntroPage from './pages/IntroPage'
import Phase1Page from './pages/Phase1Page'
import Phase2Page from './pages/Phase2Page'
import TransitionPage from './pages/TransitionPage'
import Phase3Page from './pages/Phase3Page'
import LoadingPage from './pages/LoadingPage'
import ResultPage from './pages/ResultPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/phase1" element={<Phase1Page />} />
        <Route path="/phase2" element={<Phase2Page />} />
        <Route path="/transition" element={<TransitionPage />} />
        <Route path="/phase3" element={<Phase3Page />} />
        <Route path="/loading" element={<LoadingPage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </BrowserRouter>
  )
}
