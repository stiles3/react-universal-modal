import { FC } from "react";
import { useModal } from "./ModalProvider";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

import cancel from "@/assets/images/cancel.png";
import { Button } from "../Buttons";

interface ModalComponentProps {
  modalId: string;
}

const LogoutModal: FC<ModalComponentProps> = ({ modalId }) => {
  const { modalStates, hideModal } = useModal();
  const isOpen = modalStates[modalId]?.isOpen;

  const logoutUser = async () => {
    localStorage.removeItem("tokens");
    window.location.replace("/auth/login");
  };

  if (!isOpen) return null;
  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-10 focus:outline-none"
      onClose={() => {
        hideModal(modalId);
      }}
    >
      <DialogBackdrop className="fixed inset-0 bg-black/70 w-full" />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className=" p-[46px] rounded-xl overflow-y-scroll bg-white  shadow-md backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
          >
            <div className="w-full max-w-[402px]">
              <div className="flex justify-center">
                <img src={cancel} className="w-[90px] h-[90px]" />
              </div>

              <div className="">
                <div className="text-[28px] leading-[28px] py-[20px] text-center font-bold text-black">
                  Are you sure you want to logout?
                </div>
                <p className="text-base text-center text-[#3D3D3D]">
                  Logging out will end your current session. You'll need to
                  re-enter your credentials to regain access.
                </p>
                <div className="flex justify-center flex-col items-center space-y-3 pt-[46px]">
                  <Button
                    size={"full"}
                    onClick={() => {
                      logoutUser();
                    }}
                  >
                    Yes, I am sure
                  </Button>
                  <div
                    onClick={() => {
                      hideModal(modalId);
                    }}
                    className="text-base text-primary cursor-pointer"
                  >
                    No thanks
                  </div>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default LogoutModal;
