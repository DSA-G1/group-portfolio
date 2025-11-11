import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TeamMemberCard from "@/components/TeamMemberCard";
import teamData from "@/data/team.json";

const About = () => {
  return (
    <div 
    className="min-h-screen bg-cover bg-top bg-no-repeat"
    style={{ backgroundImage: "url('/public/background/about-page.png')"}}
    >

      <Header />
      
      {/* About Section */}
      <section className="pt-32 pb-48 px-4">
        <div className="container mx-auto">
          <h1 className="font-header text-6xl md:text-7xl lg:text-8xl text-center mb-12">
            <span className="text-foreground">ABOUT </span>
            <span className="text-primary">DEVSQUAD</span>
          </h1>
          <div className="max-w-5xl mx-auto">
            <p className="font-body text-2xl md:text-3xl mb-6 text-center leading-relaxed" style={{ color: '#ffffffff' }}>
              We are the DevSquad, a group of aspiring Computer Engineers from BSCpE 2-2 driven by curiosity, teamwork, and a passion for innovation. Our mission is to design and develop creative tech projects that challenge our skills and inspire others. We focus on projects involving software development, hardware integration, and UI/UX design—combining logic and creativity to bring ideas to life.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="pt-32 pb-48 px-4">
        <div className="container mx-auto">
          <h1 className="font-header text-6xl md:text-7xl lg:text-8xl text-center mb-12">
            <span className="text-foreground">OUR </span>
            <span className="text-primary">MISSION</span>
          </h1>
          <div className="max-w-5xl mx-auto">
            <p className="font-body text-2xl md:text-3xl mb-8 text-center leading-relaxed" style={{ color: '#eaf169' }}>
              "To code with purpose, create with passion, and collaborate with heart."
            </p>
            <p className="font-body text-xl text-center text-foreground mb-12 max-w-5xl mx-auto leading-relaxed">
              Our mission is to develop innovative solutions through teamwork and technology. We focus on software development, hardware integration, and UI/UX design — using our skills to make learning, creativity, and problem-solving come alive.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="pt-32 pb-48 px-4">
        <div className="container mx-auto">
          <h1 className="font-header text-6xl md:text-7xl lg:text-8xl text-center mb-12">
            <span className="text-foreground">OUR </span>
            <span className="text-primary">TEAM</span>
          </h1>
          <p className="font-body text-xl text-center text-foreground mb-16 max-w-5xl mx-auto leading-relaxed">
            Meet the talented individuals who make the magic happen
          </p>
          <div className="grid gap-8 grid-cols-[repeat(auto-fit,minmax(360px,1fr))] justify-center">
            {teamData.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="pt-32 pb-48 px-4">
        <div className="container mx-auto">
          <h2 className="font-header text-5xl md:text-6xl lg:text-7xl text-center mb-12">
            <span className="text-foreground">OUR </span>
            <span className="text-primary">VALUES</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6 bg-card rounded-xl">
              <h3 className="font-body text-2xl text-primary mb-4">Innovation</h3>
              <p className="font-body text-foreground">
                We constantly push boundaries and embrace new technologies to deliver cutting-edge solutions.
              </p>
            </div>
            <div className="text-center p-6 bg-card rounded-xl">
              <h3 className="font-body text-2xl text-primary mb-4">Quality</h3>
              <p className="font-body text-foreground">
                Every line of code, every design element is crafted with precision and attention to detail.
              </p>
            </div>
            <div className="text-center p-6 bg-card rounded-xl">
              <h3 className="font-body text-2xl text-primary mb-4">Collaboration</h3>
              <p className="font-body text-foreground">
                We believe in the power of teamwork and value every perspective in the creative process.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;