import BannerPages from "@/components/BannerPages";
import Footer from "@/components/Footer";

export default function Home() {

  return (
    <>

      {/* Page 1 : Contacter l'agence */}
      <BannerPages
        title="Contactez"
        titleColored="notre agence"
        image="/img/photo/salon.png"
      />

      {/* Footer */}
      <Footer />

    </>
  );
}
