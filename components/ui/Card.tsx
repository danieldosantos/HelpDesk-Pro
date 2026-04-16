interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm ring-1 ring-slate-200 p-5 md:p-6 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
