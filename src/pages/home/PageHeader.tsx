
type PageHeaderProps = {
  title: string;
  description: string;
};

const PageHeader = ({ title, description }: PageHeaderProps) => {
  return (
    <div className="text-center max-w-2xl mx-auto mb-12 animate-fade-in">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
        {title}
      </h1>
      <p className="text-nightMuted">
        {description}
      </p>
    </div>
  );
};

export default PageHeader;
