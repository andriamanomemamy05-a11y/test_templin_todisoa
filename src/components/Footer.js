import styles from "./Footer.module.css";
import Image from "next/image";
import Link from "next/link";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaRegClock,
  FaGlobe
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.logoSection}>
          <Image
            src="/img/photo/logo.jpeg"
            alt="Majordhom"
            width={180}
            height={180}
            className={styles.logo}
            priority
            sizes="(max-width: 50px) 90px, 100px"
          />

        </div>
        <div className="pe-2 ps-2">
          <div className={styles.upperContainer} >
            <div className={styles.infContainer}>
              <div className={styles.infoSection}>
                <div className={styles.infoItem}>
                  <FaGlobe className={styles.icon} />
                  <Link
                    href="https://www.majordhom.fr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    https://www.majordhom.fr/
                  </Link>
                </div>
                <div className={styles.infoItem}>
                  <FaMapMarkerAlt className={styles.icon} />
                  <span>12 rue Madagascar - 13006 Marseille</span>
                </div>
                <div className={styles.infoItem}>
                  <FaPhoneAlt className={styles.icon} />
                  <a href="tel:04 91 41 13 13" className={styles.link}>
                      04 91 41 13 13
                  </a>
                </div>
                <div className={styles.infoItem}>
                  <FaEnvelope className={styles.icon} />
                  <a
                    href="mailto:contact@majordhom.fr"
                    className={styles.link}
                  >
                    contact@majordhom.fr
                  </a>
                </div>
              </div>
              <div className={styles.infoSection}>
                <p>
                  Vous souhaitez vendre, louer ou acheter un bien immobilier à Marseille ? <br />
                  L'agence Majordhom est au service de vos projets. <br />
                </p>
                
               
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
