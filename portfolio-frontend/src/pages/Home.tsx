import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TeamMemberCard from "@/components/TeamMemberCard";
import teamData from "@/data/team.json";
import { ArrowRight } from "lucide-react";

const Home = () => {
  const featuredTeam = teamData.slice(0, 3);

  return (
    <div 
      className="min-h-screen bg-cover bg-top bg-no-repeat"
      style={{backgroundImage: "url('/background/home-page.png')"}}
    >
      <Header />
      
      {/* Hero Section */}
      <section className="pt-64 pb-48 px-4">  
        <div className="container mx-auto text-center">
          <h1 className="font-body text-4xl md:text-[64px] lg:text-[84px] text-foreground mb-4">
            We Are
          </h1>

          <h2 className="font-header text-[64px] sm:text-[100px] md:text-[160px] lg:text-[200px] xl:text-[260px] leading-[0.85] font-medium mb-6">
            <span className="text-foreground">DEV</span>
            <span className="text-primary">SQUAD</span>
          </h2>

          <p className="font-body text-lg md:text-2xl lg:text-[32px] text-foreground mb-8 max-w-3xl mx-auto font-medium">
            Empowering ideas through code and creativity
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild
              className="bg-primary hover:bg-accent text-primary-foreground hover:text-accent-foreground font-body text-lg px-8 py-6 border-4 border-white rounded-full"
            >
              <NavLink to="/works">View Our Work</NavLink>
            </Button>
            <Button 
              asChild
              variant="outline"
              className="bg-primary hover:bg-accent text-primary-foreground hover:text-accent-foreground font-body text-lg px-8 py-6 border-4 border-white rounded-full"
            >
              <a href="mailto:info@devsquad.com">Get in Touch</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Team Preview Section */}
      <section className="pt-44 pb-20 px-4">
        <div className="container mx-auto">
          <h1 className="font-header text-6xl md:text-7xl lg:text-8xl text-center mb-8">
            <span className="block text-foreground">MEET OUR</span>
            <span className="block text-primary">AMAZING TEAM</span>
          </h1>
          <p className="font-body text-lg text-center text-foreground mb-12 max-w-4xl mx-auto">
            Talented individuals working together to create extraordinary digital experiences
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredTeam.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
          <div className="text-center">
            <Button 
              asChild
              className="bg-primary hover:bg-accent text-primary-foreground hover:text-accent-foreground font-body text-lg px-8 py-6 border-4 border-white rounded-full"
            >
              <NavLink to="/about" className="flex items-center gap-2">
                Meet the Full Team <ArrowRight size={20} />
              </NavLink>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          {/* Header image. Place ready.png in public/ and reference as '/ready.png' */}
          <img
            src="/ready.png"
            alt="Ready to Work"
            className="mx-auto mb-4 w-90 md:w-100 lg:w-[900px] object-contain"
            loading="eager"
          />
          <p className="font-body text-lg md:text-xl text-primary mb-8 max-w-2xl mx-auto">
            Let's create something amazing together! Whether you have a project in mind or just want to chat, we'd love to hear from you.
          </p>
          <Button 
            asChild
            size="lg"
            className="bg-primary hover:bg-accent text-primary-foreground hover:text-accent-foreground font-body text-lg px-8 py-6 border-4 border-white rounded-full"
          >
            <a href="mailto:info@devsquad.com">Start a Project</a>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
