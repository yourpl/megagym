export default function Contact() {
  return (
    <section id="contact" className="min-h-screen flex items-center justify-center px-6 py-24 border-t border-white/10">
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Get in Touch
            </h2>
            <p className="text-lg text-gray-400 mb-12">
              Ready to start your fitness journey? Contact us to schedule a tour
              or speak with our team about membership options.
            </p>

            <div className="space-y-8">
              <div>
                <h3 className="text-white font-semibold mb-2 uppercase text-xs tracking-wider">Location</h3>
                <p className="text-gray-400">123 Fitness Avenue</p>
                <p className="text-gray-400">New York, NY 10001</p>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-2 uppercase text-xs tracking-wider">Hours</h3>
                <p className="text-gray-400">Monday - Friday: 5:00 AM - 11:00 PM</p>
                <p className="text-gray-400">Saturday - Sunday: 6:00 AM - 10:00 PM</p>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-2 uppercase text-xs tracking-wider">Contact</h3>
                <p className="text-gray-400">Email: info@megagym.com</p>
                <p className="text-gray-400">Phone: (555) 123-4567</p>
              </div>
            </div>
          </div>

          <div className="border border-white/10 p-8">
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm text-gray-400 mb-2 uppercase tracking-wider">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-white transition-colors"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm text-gray-400 mb-2 uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-white transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm text-gray-400 mb-2 uppercase tracking-wider">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-white transition-colors"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm text-gray-400 mb-2 uppercase tracking-wider">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-white transition-colors resize-none"
                  placeholder="Tell us about your fitness goals..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-white text-black py-4 text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
