import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, LucideIcon } from 'lucide-react';

interface SectionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  buttonText: string;
  gradient?: 'primary' | 'secondary';
}

const SectionCard = ({
  title,
  description,
  icon: Icon,
  href,
  buttonText,
  gradient = 'primary',
}: SectionCardProps) => {
  return (
    <Link to={href} className="group block h-full">
      <div className="glass border-glow relative rounded-[2rem] p-8 h-full flex flex-col transition-all duration-500 hover:-translate-y-2 hover:shadow-elevated">
        <div
          className={`shine inline-flex self-start p-5 rounded-3xl mb-6 shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3 ${
            gradient === 'primary' ? 'gradient-primary glow-primary' : 'gradient-secondary glow-secondary'
          }`}
        >
          <Icon className="h-8 w-8 text-white drop-shadow" />
        </div>
        <h3 className="font-display text-2xl font-bold mb-3 text-foreground group-hover:text-gradient transition-colors duration-300">
          {title}
        </h3>
        <p className="text-muted-foreground mb-6 leading-relaxed flex-1">{description}</p>
        <Button
          variant={gradient === 'primary' ? 'default' : 'secondary'}
          size="lg"
          className="w-full group-hover:shadow-elevated"
        >
          {buttonText}
          <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
        </Button>
      </div>
    </Link>
  );
};

export default SectionCard;
