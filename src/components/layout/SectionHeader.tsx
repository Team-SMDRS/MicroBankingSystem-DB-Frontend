interface SectionHeaderProps {
  title: string;
  description: string;
}

const SectionHeader = ({ title, description }: SectionHeaderProps) => {
  return (
    <div className="mb-8 animate-slide-in-left">
      <h2 className="section-header text-primary">{title}</h2>
      <p className="text-secondary font-medium">{description}</p>
    </div>
  );
};

export default SectionHeader;
