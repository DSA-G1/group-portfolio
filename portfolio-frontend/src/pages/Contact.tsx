import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Globe,Server, Users, Folder, Send } from "lucide-react";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "Thank you for reaching out. We'll get back to you soon!",
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div
      className="min-h-screen bg-cover bg-top bg-no-repeat"
      style={{ backgroundImage: "url('/public/background/about-page.png')" }}
    >
      <Header />
      
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <h1 className="font-cubic text-4xl md:text-6xl text-center mb-6">
            <span className="text-foreground">Get in </span>
            <span className="text-primary">Touch</span>
          </h1>
          <p className="font-frankfurter text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Have a project in mind? Let's discuss how we can help bring your ideas to life.
          </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
            {/* Contact Form */}
            {/*
            <div className="bg-card p-8 rounded-xl">
              <h2 className="font-cubic text-2xl text-foreground mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="font-frankfurter text-foreground block mb-2">
                    Your Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="font-frankfurter"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="font-frankfurter text-foreground block mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="font-frankfurter"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="font-frankfurter text-foreground block mb-2">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="font-frankfurter"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="font-frankfurter text-foreground block mb-2">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="font-frankfurter"
                  />
                </div>
                <Button 
                  type="submit"
                  className="w-full bg-primary hover:bg-accent text-primary-foreground hover:text-accent-foreground font-frankfurter text-lg py-6"
                >
                  <Send className="mr-2" size={20} />
                  Send Message
                </Button>
              </form>
            </div>
            */}

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-card p-8 rounded-xl">
                <h2 className="font-cubic text-2xl text-foreground mb-6">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary p-3 rounded-lg">
                      <Mail className="text-primary-foreground" size={24} />
                    </div>
                    <div>
                      <h3 className="font-cubic text-foreground mb-1">Email</h3>
                      <a href="mailto:gilrpunzal.com" className="font-frankfurter text-muted-foreground hover:text-primary transition-colors">
                        gilrpunzal@gmail.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-primary p-3 rounded-lg">
                      <Phone className="text-primary-foreground" size={24} />
                    </div>
                    <div>
                      <h3 className="font-cubic text-foreground mb-1">Phone</h3>
                      <a href="tel:+1234567890" className="font-frankfurter text-muted-foreground hover:text-primary transition-colors">
                        +123 456 7890
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-primary p-3 rounded-lg">
                      <MapPin className="text-primary-foreground" size={24} />
                    </div>
                    <div>
                      <h3 className="font-cubic text-foreground mb-1">Location</h3>
                      <p className="font-frankfurter text-muted-foreground">
                        PUP Sta. Mesa, Manila, Philippines
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-primary p-8 rounded-xl text-center">
                <h3 className="font-cubic text-3xl text-primary-foreground mb-4">
                  Let's Create Together!
                </h3>
                <p className="font-frankfurter text-primary-foreground">
                  We're excited to hear about your project and explore how we can collaborate to bring your vision to life.
                </p>
              </div>
            </div>
          <div className="space-y-8">
            <div className="bg-card p-8 rounded-xl">
              <h2 className="font-cubic text-2xl text-foreground mb-6">FAQ</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary p-3 rounded-lg">
                    <Globe className="text-primary-foreground" size={24} />
                  </div>

                  <div>
                    <h3 className="font-cubic text-foreground mb-1">What is this website about?</h3>
                    <p className="font-frankfurter text-muted-foreground hover:text-primary transition-colors">
                      This website shows our collection of projects in Data Structure and Algorithms and other future tech projects.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-primary p-3 rounded-lg">
                      <Server className="text-primary-foreground" size={24} />
                    </div>
                          
                    <div>
                      <h3 className="font-cubic text-foreground mb-1">What type of projects can I find here?</h3>
                      <p className="font-frankfurter text-muted-foreground hover:text-primary transition-colors">
                        Basic and intermediate coding pojects such as Queue & Dequeue, and other upcoming DSA concepts.
                      </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="bg-primary p-3 rounded-lg">
                        <Users className="text-primary-foreground" size={24} />
                      </div>
                     <div>
                      <h3 className="font-cubic text-foreground mb-1">Who is this website for?</h3>
                      <p className="font-frankfurter text-muted-foreground">
                        For students, beginners, and anyone who wants to explore simple coding projects.
                      </p>
                     </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-primary p-3 rounded-lg">
                        <Folder className="text-primary-foreground" size={24} />
                      </div>
                     <div>
                       <h3 className="font-cubic text-foreground mb-1">Will more projects be added?</h3>
                       <p className="font-frankfurter text-muted-foreground">
                         Yes, more DSA and programming projects will be uploaded soon.
                       </p>
                      </div>
                     </div>

                     <div className="flex items-start gap-4">
                       <div className="bg-primary p-3 rounded-lg">
                         <Mail className="text-primary-foreground" size={24} />
                       </div>
                      <div>
                        <h3 className="font-cubic text-foreground mb-1">How can I contact you?</h3>
                        <p className="font-frankfurter text-muted-foreground">
                          You can reach us through our emails or social links provided on this page.
                        </p>
                      </div>
                     </div>    
                  </div>
        
                </div>
              </div>
           </div>
        </section>
        
        <Footer />
      </div>
  );
};

export default Contact;
