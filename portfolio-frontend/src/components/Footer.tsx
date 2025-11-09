import { NavLink } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="text-foreground relative z-0" style={{ backgroundColor: '#69054a' }}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <h3 className="font-cubic text-3xl font-bold mb-4">
              <span className="text-foreground">DEV</span>
              <span className="text-primary">SQUAD</span>
            </h3>
            <p className="font-frankfurter text-accent mb-4">
              Empowering ideas through code and creativity
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-frankfurter text-xl text-accent mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <NavLink to="/" className="font-frankfurter text-foreground hover:text-accent transition-colors">
                Home
              </NavLink>
              <NavLink to="/about" className="font-frankfurter text-foreground hover:text-accent transition-colors">
                About
              </NavLink>
              <NavLink to="/works" className="font-frankfurter text-foreground hover:text-accent transition-colors">
                Works
              </NavLink>
             {/*<NavLink to="/contact" className="font-frankfurter text-foreground hover:text-accent transition-colors">
                Contact
              </NavLink> */}
            </div>
          </div>

          {/* Get in Touch */}
          <div>
            <h4 className="font-frankfurter text-xl text-accent mb-4">Get in Touch</h4>
            <div className="flex flex-col gap-3">
              <a href="mailto:hello@devsquad.com" className="font-frankfurter text-foreground hover:text-accent transition-colors flex items-center gap-2">
                <Mail size={18} />
                info@devsquad.com
              </a>
              <a href="tel:+1234567890" className="font-frankfurter text-foreground hover:text-accent transition-colors flex items-center gap-2">
                <Phone size={18} />
                +123 456 7890
              </a>
              <div className="font-frankfurter text-foreground flex items-center gap-2">
                <MapPin size={18} />
                Manila, Philippines
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-foreground/20 pt-6">
          <p className="font-frankfurter text-center text-foreground">
            © 2025 DEVSQUAD. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
