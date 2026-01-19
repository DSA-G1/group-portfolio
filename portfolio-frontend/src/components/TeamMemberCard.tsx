import SocialLinks from "./SocialLinks";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  bio: string;
  skills: string[];
  portfolio?: string; // new field for View Portfolio button
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
    <div className="relative rounded-[50px] transition-all hover:scale-[1.03] h-full">
      {/* Glow effect behind the card */}
      <div className="absolute inset-0 rounded-[50px] blur-3xl opacity-20 bg-[#f181b6] -z-10"></div>

      {/* 🪩 Glassmorphism Card */}
      <div className="relative overflow-hidden rounded-[50px] bg-white/30 backdrop-blur-md shadow-md transition-all flex flex-col h-full border-2 border-[#f181b6] hover:bg-[#1f1131] hover:shadow-lg">
        <div className="p-6 md:p-8 flex-1 flex flex-col">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 flex-1">
            {/* Avatar */}
            <div className="flex-shrink-0 w-28 h-28 md:w-32 md:h-32 rounded-[50px] overflow-hidden bg-muted/20 backdrop-blur-sm">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-cubic text-xl md:text-2xl text-white">{member.name}</h3>
                <p className="font-body text-md text-primary/90 mt-1">{member.role}</p>

                <p className="font-body text-sm text-white/80 mt-4 mb-4">
                  {member.bio}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {member.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full text-xs font-frankfurter"
                      style={{
                        color: "#f181b6",
                        backgroundColor: "rgba(241, 129, 182, 0.2)",
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom actions */}
              <div className="flex items-center gap-4 mt-auto">
                {/* View Portfolio Button */}
                <a
                  href={member.portfolio ?? "#"} // uses the new portfolio field
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-transparent text-[#f181b6] rounded-full shadow-md border-2 border-[#f181b6] transition-all hover:bg-[#eaf169] hover:border-[#eaf169] backdrop-blur-sm"
                >
                  <span className="text-sm font-frankfurter">View Portfolio</span>
                </a>

                {/* Social Icons */}
                {member.social && (
                  <div className="flex items-center gap-2">
                    <SocialLinks
                      github={member.social.github} // GitHub icon
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
    </div>
  );
};

export default TeamMemberCard;