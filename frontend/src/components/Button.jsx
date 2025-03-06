export default function Button({ children, onClick, type = "primary" }) {
    const baseStyles = "px-4 py-2 rounded-md font-semibold transition";
    const styles = {
      primary: "bg-blue-600 text-white hover:bg-blue-700",
      secondary: "bg-gray-500 text-white hover:bg-gray-600",
      danger: "bg-red-500 text-white hover:bg-red-600",
    };
  
    return (
      <button onClick={onClick} className={`${baseStyles} ${styles[type]}`}>
        {children}
      </button>
    );
  }
  