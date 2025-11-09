import { Github, Linkedin, Mail } from "lucide-react";

interface SocialLinksProps {
  github?: string;
  linkedin?: string;
  email?: string;
  className?: string;
}

const SocialLinks = ({ github, linkedin, email, className = "" }: SocialLinksProps) => {
  return (
    <div className={`flex gap-3 justify-center ${className}`}>
      {github && (
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-foreground/10 hover:bg-primary rounded-full transition-all hover:scale-110"
          aria-label="GitHub"
        >
          <Github size={18} className="text-foreground hover:text-primary-foreground" />
        </a>
      )}
      {linkedin && (
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-foreground/10 hover:bg-primary rounded-full transition-all hover:scale-110"
          aria-label="LinkedIn"
        >
          <Linkedin size={18} className="text-foreground hover:text-primary-foreground" />
        </a>
      )}
      {email && (
        <a
          href={`mailto:${email}`}
          className="p-2 bg-foreground/10 hover:bg-primary rounded-full transition-all hover:scale-110"
          aria-label="Email"
        >
          <Mail size={18} className="text-foreground hover:text-primary-foreground" />
        </a>
      )}
    </div>
  );
};

export default SocialLinks;