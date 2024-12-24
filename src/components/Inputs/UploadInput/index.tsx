import React, { useRef, useState } from "react";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { cva, type VariantProps } from "class-variance-authority";
import uploadImg from "@/assets/images/upload-img.png";
import Card from "@/components/Card";

const uploadVariants = cva(
  "flex h-[58px] w-full items-center justify-center rounded-md border border-input bg-white text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-background",
        ghost: "border-none shadow-none",
      },
      state: {
        error: "border-destructive",
        default: "",
      },
    },
    defaultVariants: {
      variant: "default",
      state: "default",
    },
  }
);

interface UploadProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof uploadVariants> {
  error?: string;
  setCropActive: (cropActive: boolean) => void;
  onCrop?: (croppedFile: File) => void;
  onFullImage?: (file: File) => void;
  image: string | null;
  setImage: (image: string | null) => void;
}

const Upload = React.forwardRef<HTMLInputElement, UploadProps>(
  ({
    className,
    error,
    variant,
    onCrop,
    onFullImage,
    setCropActive,
    image,
    setImage,
    ...props
  }) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);
    const [crop, setCrop] = useState<Crop>({
      unit: "%",
      width: 50,
      height: 50,
      x: 25,
      y: 25,
    });
    const [fileError, setFileError] = useState<string | null>(null);
    const [currentFile, setCurrentFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        const validTypes = ["image/jpeg", "image/png", "image/jpg"];
        const maxSize = 3 * 1024 * 1024; // 3MB

        // Check file type and size
        if (!validTypes.includes(file.type)) {
          setFileError("Please upload a JPEG or PNG file.");
          return;
        }

        if (file.size > maxSize) {
          setFileError("File size must not exceed 3MB.");
          return;
        }

        // Reset error state and read the file
        setFileError(null);
        setCurrentFile(file);
        const reader = new FileReader();
        reader.onload = () => {
          setImage(reader.result as string);
        };
        reader.readAsDataURL(file);
        setCropActive(true);
      }
    };

    const handleUseFullImage = () => {
      if (currentFile && onFullImage) {
        onFullImage(currentFile);
        setCropActive(false);
      }
    };

    const getCroppedImg = (
      image: HTMLImageElement,
      crop: Crop
    ): Promise<Blob> => {
      const canvas = document.createElement("canvas");
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = Math.floor(crop.width * scaleX);
      canvas.height = Math.floor(crop.height * scaleY);
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        return Promise.reject(new Error("No 2d context"));
      }

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY
      );

      return new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Canvas is empty"));
              return;
            }
            resolve(blob);
          },
          "image/png",
          1
        );
      });
    };

    const handleComplete = async (crop: Crop) => {
      if (onCrop && imgRef.current && crop.width && crop.height) {
        try {
          const croppedBlob = await getCroppedImg(imgRef.current, crop);
          const fileName =
            inputRef.current?.files?.[0]?.name || "cropped-image.png";
          const croppedFile = new File([croppedBlob], fileName, {
            type: "image/png",
          });
          onCrop(croppedFile);
        } catch (e) {
          console.error("Error creating cropped file:", e);
        }
      }
    };

    return (
      <div className="w-full flex flex-col justify-center items-center mx-auto">
        <input
          type="file"
          ref={inputRef}
          className="hidden"
          onChange={handleFileChange}
          accept="image/jpeg, image/png, image/jpg"
          {...props}
        />
        {image ? (
          <Card
            className="cursor-pointer min-h-[300px] mx-auto md:min-h-[400px] bg-white w-full md:w-[596px] space-y-6 flex flex-col items-center justify-center overflow-hidden"
            variant={"outlined-dotted"}
          >
            <ReactCrop
              crop={crop}
              onChange={(percentCrop) => setCrop(percentCrop)}
              onComplete={handleComplete}
              className="h-full w-full"
            >
              <img
                ref={imgRef}
                src={image}
                className="max-h-full w-full object-contain"
                alt="Upload preview"
              />
            </ReactCrop>
          </Card>
        ) : (
          <Card
            className="cursor-pointer h-[300px] md:h-[400px] bg-white w-full md:w-[596px] space-y-6 flex flex-col items-center justify-center"
            variant={"outlined-dotted"}
            onClick={() => inputRef.current?.click()}
          >
            <img src={uploadImg} className="w-[160px]" alt="Upload icon" />
            <span className="font-medium text-lg text-primary">
              Tap to upload File
            </span>
          </Card>
        )}
        {fileError && (
          <p className="mt-2 text-xs text-destructive">{fileError}</p>
        )}
        {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
        {image && (
          <button
            onClick={handleUseFullImage}
            className="mt-4 text-primary hover:underline"
          >
            Use Full Image
          </button>
        )}
      </div>
    );
  }
);

Upload.displayName = "Upload";

export { Upload, uploadVariants };
