import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TeamMemberCard from "@/components/TeamMemberCard";
import teamData from "@/data/team.json";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* About Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <h1 className="font-cubic text-4xl md:text-6xl text-center mb-8">
            <span className="text-foreground">About </span>
            <span className="text-primary">DEVSQUAD</span>
          </h1>
          <div className="max-w-4xl mx-auto">
            <p className="font-frankfurter text-lg text-foreground mb-6 text-center">
              We are a passionate team of developers, designers, and creators who believe in the power of technology to transform ideas into reality. Our mission is to build innovative digital solutions that make a difference.
            </p>
            <p className="font-frankfurter text-lg text-foreground mb-6 text-center">
              With expertise spanning across web development, mobile apps, AI integration, and UI/UX design, we bring a holistic approach to every project. We don't just write code – we craft experiences that resonate with users and drive results.
            </p>
            <p className="font-frankfurter text-lg text-foreground text-center">
              Our collaborative approach ensures that every voice is heard, every idea is explored, and every solution is crafted with precision and care. Together, we turn your vision into a digital masterpiece.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-muted">
        <div className="container mx-auto">
          <h2 className="font-cubic text-3xl md:text-5xl text-center mb-4">
            <span className="text-foreground">Our </span>
            <span className="text-primary">Team</span>
          </h2>
          <p className="font-frankfurter text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Meet the talented individuals who make the magic happen
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamData.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="font-cubic text-3xl md:text-5xl text-center mb-12">
            <span className="text-foreground">Our </span>
            <span className="text-primary">Values</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6 bg-card rounded-xl">
              <h3 className="font-cubic text-2xl text-primary mb-4">Innovation</h3>
              <p className="font-frankfurter text-foreground">
                We constantly push boundaries and embrace new technologies to deliver cutting-edge solutions.
              </p>
            </div>
            <div className="text-center p-6 bg-card rounded-xl">
              <h3 className="font-cubic text-2xl text-primary mb-4">Quality</h3>
              <p className="font-frankfurter text-foreground">
                Every line of code, every design element is crafted with precision and attention to detail.
              </p>
            </div>
            <div className="text-center p-6 bg-card rounded-xl">
              <h3 className="font-cubic text-2xl text-primary mb-4">Collaboration</h3>
              <p className="font-frankfurter text-foreground">
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
