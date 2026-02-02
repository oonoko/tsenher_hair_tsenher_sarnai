import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import OrderForm from './pages/OrderForm'
import GreetingPage from './pages/GreetingPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OrderForm />} />
        <Route path="/greeting" element={<GreetingPage />} />
      </Routes>
    </Router>
  )
}

export default App
