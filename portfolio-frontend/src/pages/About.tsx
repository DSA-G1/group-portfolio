import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TeamMemberCard from "@/components/TeamMemberCard";
import teamData from "@/data/team.json";

const About = () => {
  return (
    <div 
    className="min-h-screen bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: "url('/public/background/about-page.png')"}}
    >

      <Header />
      
      {/* About Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <h1 className="font-header text-5xl md:text-6xl text-center mb-8">
            <span className="text-foreground">ABOUT </span>
            <span className="text-primary">DEVSQUAD</span>
          </h1>
          <div className="max-w-4xl mx-auto">
            <p className="font-body text-lg mb-6 text-center" style={{ color: '#eaf169' }}>
              We are the DevSquad, a group of aspiring Computer Engineers from BSCpE 2-2
              driven by curiosity, teamwork, and a passion for innovation. Our mission is to design
              and develop creative tech projects that challenge our skills and inspire others. We
              focus on projects involving software development, hardware integration, and UI/UX 
              design—combining logic and creativity to bring ideas to life. 
            </p>
          </div>
        </div>
      </section>
      {/* Team Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="font-header text-5xl md:text-5xl text-center mb-4">
            <span className="text-foreground">OUR </span>
            <span className="text-primary">TEAM</span>
          </h2>
          <p className="font-body text-lg text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
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
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="font-header text-5xl md:text-5xl text-center mb-12">
            <span className="text-foreground">OUR </span>
            <span className="text-primary">VALUES</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6 bg-card rounded-xl">
              <h3 className="font-header text-2xl text-primary mb-4">Innovation</h3>
              <p className="font-body text-foreground">
                We constantly push boundaries and embrace new technologies to deliver cutting-edge solutions.
              </p>
            </div>
            <div className="text-center p-6 bg-card rounded-xl">
              <h3 className="font-header text-2xl text-primary mb-4">Quality</h3>
              <p className="font-body text-foreground">
                Every line of code, every design element is crafted with precision and attention to detail.
              </p>
            </div>
            <div className="text-center p-6 bg-card rounded-xl">
              <h3 className="font-header text-2xl text-primary mb-4">Collaboration</h3>
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
