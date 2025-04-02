import React from "react";
import Image from "next/image";

interface Props {
  title: string;
  images: string[];
}

const ImageGallery: React.FC<Props> = ({ title, images }) => {
  if (!images || images.length === 0) {
    return (
      <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
        Sin imágenes
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-8">
      <div className="bg-gray-200 h-96 rounded-lg overflow-hidden relative">
        <Image
          src={images[0]}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {images.slice(1, 5).map((img, i) => (
          <div
            key={i}
            className="bg-gray-200 h-48 rounded-lg overflow-hidden relative"
          >
            <Image
              src={img}
              alt={`${title} ${i + 2}`}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
