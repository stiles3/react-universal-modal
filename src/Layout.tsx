import { ModalProvider } from "@/components/Modal/ModalProvider";

import LogoutModal from "./components/Modal/LogoutModal";

export enum ModalId {
  LOGOUT_MODAL = "logout",
}

const Layout: React.FC<any> = ({ children }) => {
  return (
    <ModalProvider>
      <LogoutModal modalId={ModalId.LOGOUT_MODAL} />

      {children}
    </ModalProvider>
  );
};

export default Layout;
