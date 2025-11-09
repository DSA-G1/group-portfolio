import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
  technologies: string[];
  link: string;
}

interface ProjectModalProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProjectModal = ({ project, open, onOpenChange }: ProjectModalProps) => {
  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="font-cubic text-2xl text-foreground">{project.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <img 
            src={project.image} 
            alt={project.title}
            className="w-full rounded-lg"
          />
          <p className="font-frankfurter text-sm text-accent">{project.category}</p>
          <p className="font-frankfurter text-foreground">{project.description}</p>
          
          <div>
            <h4 className="font-cubic text-lg text-foreground mb-3">Technologies Used</h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-frankfurter"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <Button 
            asChild
            className="w-full bg-primary hover:bg-accent text-primary-foreground hover:text-accent-foreground font-frankfurter"
          >
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              Visit Project <ExternalLink size={18} />
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;
