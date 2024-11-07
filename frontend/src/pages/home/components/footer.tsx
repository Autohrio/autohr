

const Footer = () => {
  return (
    <footer className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">AutoHr</h3>
            <p>Redefining Human Resource Management</p>
          </div>
          <div>
            <h4 className="font-bold mb-2">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/about-us" className="text-gray-600">About Us</a></li>
              <li><a href="/" className="text-gray-600">Services</a></li>
              <li><a href="/contact" className="text-gray-600">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-2">Resources</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-600">FAQs</a></li>
              <li><a href="/support" className="text-gray-600">Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-2">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="/" className="text-2xl text-gray-600">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="/" className="text-2xl text-gray-600">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="/" className="text-2xl text-gray-600">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p>&copy; {new Date().getFullYear()} AutoHr. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer;