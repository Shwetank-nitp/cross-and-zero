import cross from "../../assets/2.svg";
import zero from "../../assets/1.svg";

export function AnimatedButton({ onClick, children, classes }) {
  return (
    <div className={`container ${classes}`} onClick={onClick}>
      <a href="#" className="button">
        <div className="button__content">
          <span className="button__text">{children}</span>
          <i className="ri-download-cloud-fill button__icon"></i>

          <div className="button__reflection-1"></div>
          <div className="button__reflection-2"></div>
        </div>
        <img src={cross} alt="" className="button__star-1" />
        <img src={cross} alt="" className="button__star-2" />
        <img src={zero} alt="" className="button__circle-1" />
        <img src={cross} alt="" className="button__circle-2" />
        <img src={zero} alt="" className="button__diamond" />
        <img src={zero} alt="" className="button__triangle" />
        <div className="button__shadow"></div>
      </a>
    </div>
  );
}

export function DangerButton({ children, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={`py-2 px-3 bg-red-600 rounded-md shadow-md hover:shadow-lg hover:bg-red-500 hover:scale-105 transition-transform duration-3000 ease-out ${className}`}
    >
      {children}
    </button>
  );
}
export function PrimaryButton({ children, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={`py-2 px-3 bg-purple-600 rounded-md shadow-md hover:shadow-lg hover:bg-purple-500 hover:scale-105 transition-transform duration-3000 ease-out ${className}`}
    >
      {children}
    </button>
  );
}
