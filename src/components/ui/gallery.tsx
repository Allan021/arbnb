"use client";

import Image from "next/image";
import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Images } from "lucide-react";

type Props = {
  images: string[];
  title: string;
};

export const MosaicGalleryWithPreviewModal = ({ images, title }: Props) => {
  const [showMosaicModal, setShowMosaicModal] = useState(false);
  const [showCarousel, setShowCarousel] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const openMosaicModal = () => setShowMosaicModal(true);
  const closeMosaicModal = () => setShowMosaicModal(false);

  const openCarousel = (index: number) => {
    setActiveIndex(index);
    setShowCarousel(true);
  };

  const closeCarousel = () => setShowCarousel(false);

  const nextImage = () => setActiveIndex((prev) => (prev + 1) % images.length);

  const prevImage = () =>
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <>
      {/* Galería preview inicial */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 rounded-lg overflow-hidden mb-6">
        {images.slice(0, 5).map((img, i) => {
          const isFirst = i === 0;
          const isLast = i === 4 && images.length > 5;

          return (
            <div
              key={i}
              className={`relative group overflow-hidden cursor-pointer ${
                isFirst
                  ? "col-span-2 row-span-2 md:row-span-2 h-72 md:h-full"
                  : "h-36 md:h-40"
              }`}
              onClick={openMosaicModal}
            >
              <Image
                src={img}
                alt={`${title} ${i + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
              />

              {/* Overlay en la última imagen */}
              {isLast && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition">
                  <div className="flex items-center gap-2 bg-white/90 px-4 py-2 rounded-full text-sm font-medium shadow hover:bg-white">
                    <Images className="w-4 h-4 text-black" />
                    <span className="text-black">Mostrar todas las fotos</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal Mosaico */}
      <Dialog
        open={showMosaicModal}
        onClose={closeMosaicModal}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/80" />
        <div className="fixed inset-0 flex items-start justify-center p-4 overflow-y-auto pt-16">
          <Dialog.Panel className="w-full max-w-6xl bg-white rounded-lg p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Todas las fotos</h2>
              <button
                onClick={closeMosaicModal}
                className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mosaico estilo Masonry */}
            <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
              {images.map((img, index) => (
                <div
                  key={index}
                  className="relative w-full break-inside-avoid rounded-lg overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="relative w-full h-60 sm:h-64 md:h-72 lg:h-80">
                    <Image
                      src={img}
                      alt={`Mosaico ${index + 1}`}
                      fill
                      className="object-cover rounded-lg transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                    onClick={() => {
                      setShowMosaicModal(false);
                      openCarousel(index);
                    }}
                  >
                    <span className="text-white text-sm font-medium bg-black/60 px-3 py-1 rounded-full shadow">
                      Ver en grande
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Modal Carrusel */}
      <Dialog
        open={showCarousel}
        onClose={closeCarousel}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/90" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="relative w-full max-w-6xl h-[85vh] bg-black rounded-lg overflow-hidden shadow-lg">
            {/* Botón cerrar solo el carrusel */}
            <button
              onClick={closeCarousel}
              className="absolute top-4 right-4 z-50 bg-white p-2 rounded-full hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5 text-black" />
            </button>

            {/* Botón volver al mosaico */}
            <button
              onClick={() => {
                closeCarousel();
                setShowMosaicModal(true);
              }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 bg-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-gray-100 transition"
            >
              Cerrar
            </button>

            <div className="relative w-full h-full">
              <Image
                src={images[activeIndex]}
                alt={`Imagen ${activeIndex + 1}`}
                fill
                className="object-contain transition-all"
              />
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-white/90 hover:bg-white p-2 rounded-full shadow"
              >
                <ChevronLeft className="w-6 h-6 text-black" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-white/90 hover:bg-white p-2 rounded-full shadow"
              >
                <ChevronRight className="w-6 h-6 text-black" />
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};
