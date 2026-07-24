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
      <div className="glass relative h-full flex flex-col p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
        <div className="flex items-start justify-between mb-4">
          <div
            className={`inline-flex p-2.5 rounded-lg shadow-sm ${
              gradient === 'primary' ? 'gradient-primary' : 'gradient-secondary'
            }`}
          >
            <Icon className="h-5 w-5 text-white" />
          </div>
          {badge && (
            <span className="text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-accent/15 text-accent">
              {badge}
            </span>
          )}
        </div>
        <h3 className="font-display text-lg font-semibold mb-1 text-foreground">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed flex-1">{description}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          {buttonText}
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
};

export default SectionCard;
