import '@/styles/tailwind.css';
import '@/app/globals.css';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Seo from '@/components/Seo';

export default function HomePage() {
  return (
    <>
      {/* SEO for the whole page */}
      <Seo title="Portfolio" description="Personal portfolio website" />
      <section id="home"><Hero /></section>
      <section id="about"><About /></section>
      <section id="skills"><Skills /></section>
      <section id="projects"><Projects /></section>
      <section id="contact"><ContactForm /></section>
    </>
  );
}
