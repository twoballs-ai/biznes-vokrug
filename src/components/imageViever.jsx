import React from "react";
import Image from "next/image";

const ImageViewer = ({ src, alt, className }) => {
  return (
    <div
      className={`relative overflow-hidden rounded-md shadow-md ${
        className || "w-full h-0 pb-[60%]"
      }`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
        className="object-cover object-center"
        priority
        unoptimized
      />
    </div>
  );
};

export default ImageViewer;