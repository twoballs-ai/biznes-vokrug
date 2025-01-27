import React from "react";
import Image from "next/image";

const ImageViewer = ({ src, alt }) => {
  return (
    <div className="relative w-full h-0 pb-[60%] overflow-hidden rounded-md shadow-md">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
        className="object-cover object-center"
        priority
      />
    </div>
  );
};

export default ImageViewer;
