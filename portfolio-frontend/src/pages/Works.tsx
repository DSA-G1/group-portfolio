import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import ProjectModal from "@/components/ProjectModal";
import projectsData from "@/data/projects.json";

const Works = () => {
  const [selectedProject, setSelectedProject] = useState<typeof projectsData[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProjectClick = (project: typeof projectsData[0]) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <h1 className="font-cubic text-4xl md:text-6xl text-center mb-6">
            <span className="text-foreground">OUR AMAZING </span>
            <span className="text-primary">WORKS</span>
          </h1>
          <p className="font-frankfurter text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Explore our portfolio of innovative solutions and creative projects that showcase our expertise and passion for excellence.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projectsData.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project}
                onClick={() => handleProjectClick(project)}
              />
            ))}
          </div>
        </div>
      </section>

      <ProjectModal 
        project={selectedProject}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />

      <Footer />
    </div>
  );
};

export default Works;
