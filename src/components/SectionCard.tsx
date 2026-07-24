import { Link } from 'react-router-dom';
import { ArrowRight, LucideIcon } from 'lucide-react';

interface SectionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  buttonText: string;
  gradient?: 'primary' | 'secondary';
  badge?: string;
}

const SectionCard = ({
  title,
  description,
  icon: Icon,
  href,
  buttonText,
  gradient = 'primary',
  badge,
}: SectionCardProps) => {
  return (
    <Link to={href} className="group block h-full">
      <div className="glass shine relative h-full flex flex-col p-6 !rounded-3xl transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_20px_50px_rgba(8,15,30,0.35),0_0_30px_rgba(45,212,191,0.12)]">
        <div className="flex items-start justify-between mb-4">
          <div
            className={`inline-flex p-3 rounded-2xl shadow-md transition-transform duration-500 group-hover:scale-110 ${
              gradient === 'primary' ? 'gradient-primary' : 'gradient-secondary'
            }`}
          >
            <Icon strokeWidth={1.75} className="h-5 w-5 text-white" />
          </div>
          {badge && (
            <span className="text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full bg-accent/20 text-accent-foreground border border-accent/30">
              {badge}
            </span>
          )}
        </div>
        <h3 className="font-display text-lg font-semibold mb-1.5 text-foreground">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed flex-1">{description}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          {buttonText}
          <ArrowRight strokeWidth={1.75} className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
};

export default SectionCard;
