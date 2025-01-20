import React from "react";
import Image from "next/image";

const ImageViewer = ({ src, alt }) => {
  return (
    <div className="relative w-full h-0 pb-[60%] overflow-hidden rounded-md shadow-md">
      {/* 
        pb-[60%] значит что высота ~60% от ширины, 
        создавая отношение сторон 5:3. Можешь менять по вкусу. 
      */}
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover object-center"
        priority
      />
    </div>
  );
};

export default ImageViewer;
