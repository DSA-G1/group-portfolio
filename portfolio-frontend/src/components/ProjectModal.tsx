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
      <DialogContent className="max-h-[90vh] overflow-y-auto w-[90%] md:w-[70%] max-w-none">
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
            <h3 className="font-cubic text-lg text-foreground mb-2">Technologies Used</h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="font-frankfurter bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <Button
            className="bg-primary hover:bg-accent text-primary-foreground hover:text-accent-foreground font-body text-lg px-8 py-6 border-4 border-white rounded-full"
            onClick={() => window.open(project.link, "_blank")}
          >
            <ExternalLink className="mr-2" size={20} />
            View Project
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;
