import { ExternalLink } from "lucide-react";

interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
  technologies: string[];
  link: string;
}

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

const ProjectCard = ({ project, onClick }: ProjectCardProps) => {
  return (
    <div 
      onClick={onClick}
      className="group cursor-pointer overflow-hidden rounded-xl bg-card transition-all hover:scale-105"
    >
      <div className="aspect-video overflow-hidden relative">
        <img
          src={project.image}
          alt={project.title}
          className="h-full w-full object-cover transition-all group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/80 transition-all flex items-center justify-center">
          <ExternalLink className="text-foreground opacity-0 group-hover:opacity-100 transition-opacity" size={40} />
        </div>
      </div>
      <div className="p-6">
        <p className="font-frankfurter text-xs text-accent mb-2">{project.category}</p>
        <h3 className="font-cubic text-xl text-foreground mb-2">{project.title}</h3>
        <p className="font-frankfurter text-sm text-muted-primary line-clamp-2">{project.description}</p>
      </div>
    </div>
  );
};

export default ProjectCard;
