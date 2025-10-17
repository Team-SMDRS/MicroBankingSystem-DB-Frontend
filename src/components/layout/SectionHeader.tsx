interface SectionHeaderProps {
  title: string;
  description: string;
}

const SectionHeader = ({ title, description }: SectionHeaderProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-3xl font-semibold text-[#264653] mb-3">{title}</h2>
      <p className="text-[#6C757D] text-lg">{description}</p>
    </div>
  );
};

export default SectionHeader;
