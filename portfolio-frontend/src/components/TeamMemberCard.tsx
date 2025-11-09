interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  bio: string;
  skills: string[];
}

interface TeamMemberCardProps {
  member: TeamMember;
}

const TeamMemberCard = ({ member }: TeamMemberCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-card transition-all hover:scale-105">
      <div className="aspect-square overflow-hidden">
        <img
          src={member.image}
          alt={member.name}
          className="h-full w-full object-cover transition-all group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-6">
          <div className="text-center">
            <h3 className="font-cubic text-xl text-foreground mb-2">{member.name}</h3>
            <p className="font-frankfurter text-sm text-foreground mb-3">{member.role}</p>
            <p className="font-frankfurter text-xs text-foreground/90 mb-3">{member.bio}</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {member.skills.map((skill, index) => (
                <span key={index} className="px-2 py-1 bg-accent text-accent-foreground rounded-full text-xs font-frankfurter">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-cubic text-lg text-foreground">{member.name}</h3>
        <p className="font-frankfurter text-sm text-primary">{member.role}</p>
      </div>
    </div>
  );
};

export default TeamMemberCard;
