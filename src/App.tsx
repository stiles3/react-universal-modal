import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Layout, { ModalId } from "./Layout";
import { useModal } from "./components/Modal/ModalProvider";

function App() {
  const { showModal } = useModal();

  return (
    <>
      <div className="card bg-slate-300">
        <button onClick={() => showModal(ModalId.LOGOUT_MODAL)}>
          Click to logout
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
    </>
  );
}

export default App;
