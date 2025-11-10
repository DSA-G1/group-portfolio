import SocialLinks from "./SocialLinks";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  bio: string;
  skills: string[];
  social?: {
    github?: string;
    linkedin?: string;
    email?: string;
  };
}

interface TeamMemberCardProps {
  member: TeamMember;
}

const TeamMemberCard = ({ member }: TeamMemberCardProps) => {
  return (
    <div className="relative overflow-hidden rounded-xl bg-card transition-all hover:scale-105">
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar (rounded square) */}
          <div className="flex-shrink-0 w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-muted"> {/* Avatar pics */}
            <img
              src={member.image}
              alt={member.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-cubic text-xl md:text-2xl text-foreground">{member.name}</h3>
                <p className="font-body text-sm text-primary mt-1">{member.role}</p>
              </div>
            </div>

            <p className="font-body text-sm text-foreground/90 mt-4 mb-4">
              {member.bio}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {member.skills.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-xs font-frankfurter">
                  {skill}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4">
              {/* Primary action - View Portfolio (if social.email or a portfolio link exists, placeholder) */}
              <a
                href={member.social?.github ?? '#'}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full shadow-md"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M14 3H21V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M21 3L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M21 21H3V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-sm font-frankfurter">View Portfolio</span>
              </a>

              {/* Social links (icons) - clickable */}
              {member.social && (
                <div className="flex items-center gap-2">
                  <SocialLinks
                    github={member.social.github}
                    linkedin={member.social.linkedin}
                    email={member.social.email}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard;
