import Spinner from "@/components/SpinnerTeste";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-20">
      <div className="">
        <h1>TREINO</h1>
        <p>Vamos Treinar</p>
      </div>
      <Spinner />
    </div>
  );
}
