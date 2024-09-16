export function ContainerGlass({ children, className }) {
  return (
    <div
      className={`bg-white bg-opacity-10 backdrop-blur-md border border-white/30 rounded-lg p-6 shadow-md w-[95%] sm:max-w-[460px] ${className}`}
    >
      {children}
    </div>
  );
}
