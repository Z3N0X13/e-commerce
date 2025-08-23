"use client";

import { toast } from "sonner";
import { Star } from "lucide-react";
import { Session } from "next-auth";
import { Suspense, useEffect } from "react";

import { items } from "@/lib/constants";
import TopBar from "@/components/global/TopBar";
import Footer from "@/components/global/Footer";
import GpuViewer from "@/components/GpuViewer";
import { AnimatedButton } from "@/components/global/AnimatedButton";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

export function DashboardClient({ session }: { session: Session }) {
  useEffect(() => {
    toast.message("Ravi de vous revoir, " + session.user?.name + " !", {
      duration: 5000,
    });
  }, [session]);

  return (
    <>
      <TopBar />
      <main className="flex flex-col items-center justify-center bg-gray-100 w-full min-h-screen pt-16 dark:bg-black/30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          <div className="rounded-xl overflow-hidden shadow-xl max-w-6xl w-full">
            <video
              className="w-full h-auto object-cover"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="/video/GeForce_RTX_40_Series.mp4" type="video/mp4" />
              <p className="text-white">
                Impossible de charger la vidéo. Veuillez réessayer.
              </p>
            </video>
          </div>

          <div className="flex items-center justify-center p-8">
            <div className="text-left">
              <h1 className="text-6xl font-bold mb-4 ml-4">RTX 40 Series</h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-6 ml-4 max-w-2xl">
                Découvrez une puissance inégalée et des graphismes de nouvelle
                génération pour transformer votre expérience de jeu.
              </p>
              <AnimatedButton
                className="ml-4 px-8 py-6 text-xl dark:text-white"
                baseColor="bg-black dark:bg-green-500"
                hoverColor="dark:hover:bg-green-600"
                onClick={() => (window.location.href = "/dashboard/products/details/nvidia-rtx-4090")}
              >
                En savoir plus
              </AnimatedButton>
            </div>
          </div>
        </div>
        <div className="flex justify-center w-full mt-12 dark">
          <InfiniteMovingCards
            items={items}
            direction="left"
            speed="normal"
            pauseOnHover={true}
          />
        </div>
        <section className="flex flex-col md:flex-row gap-x-32 items-center justify-center py-12 px-8 mb-8 max-w-7xl mx-auto">
          <div className="flex-1 flex justify-center w-full relative">
            <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-lg px-4 py-2 rounded-full z-20 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3v18" />
                <path d="M16.24 7.76a6 6 0 0 1 0 8.49" />
                <path d="M7.76 7.76a6 6 0 0 0 0 8.49" />
              </svg>
              <span className="text-white text-sm font-medium">
                Modèle 3D interactif
              </span>
            </div>
            <div className="w-full max-w-xl">
              <Suspense
                fallback={
                  <span className="text-center text-white">Chargement...</span>
                }
              >
                <GpuViewer />
              </Suspense>
            </div>
          </div>

          <div className="flex-1 w-full space-y-6">
            <h2 className="text-3xl font-bold mb-2">NVIDIA RTX 4090</h2>
            <span className="inline-block bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold mb-4">
              En stock
            </span>
            <ul className="text-base text-gray-600 dark:text-gray-400 space-y-2 mb-4">
              <li>• 24 Go GDDR6X</li>
              <li>
                • Ray tracing de 3<sup>ème</sup> génération
              </li>
              <li>• PCIe 4.0</li>
              <li>• Consommation : 450W</li>
              <li>• 3 ans de garantie</li>
            </ul>
            <div className="flex items-end gap-4 mb-4">
              <span className="text-4xl font-bold text-green-400">1 999 €</span>
              <span className="text-sm text-gray-400 line-through dark:text-gray-300">
                2 299 €
              </span>
            </div>
            <AnimatedButton
              size={"lg"}
              baseColor="bg-green-600"
              hoverColor="hover:bg-green-700"
              className="w-full cursor-pointer dark:text-white"
              onClick={() =>
                (window.location.href =
                  "/dashboard/products/details/nvidia-rtx-4090")
              }
            >
              Commander maintenant
            </AnimatedButton>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill={"#facc15"}
                  stroke="#facc15"
                />
              ))}
              <span className="text-sm text-gray-400 dark:text-gray-300">(11 avis)</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
