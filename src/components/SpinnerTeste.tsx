import { FiUploadCloud } from "react-icons/fi";

export default function SpinnerTeste() {
  return (
    <div className="flex items-center justify-center w-20 h-20 rounded-full relative overflow-hidden group">
      <div
        className="duration-500   absolute inset-0 transition-transform  group-hover:-rotate-180"
        style={{
          background: "radial-gradient(circle at 30% 30%, #2DE455, #021d08 100%)",
          transform: "rotate(320deg)",
        }}
      />
      <FiUploadCloud size={32} className="z-10 text-white" />
    </div>
  );
}
